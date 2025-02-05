const puppeteer = require('puppeteer-core');
const { Datos, CorreosEnviados } = require('./database/models');
const nodemailer = require('nodemailer');

require('dotenv').config();

/**
 * Importación de variables de entorno
 */
const scrapingUrl = process.env.SCRAPING_URL;
const emailHost = process.env.EMAIL_SMTP_HOST;
const emailPort = process.env.EMAIL_SMTP_PORT;
const emailSecure = process.env.EMAIL_SMTP_SECURE;
const emailUser = process.env.EMAIL_SMTP_USER;
const emailPass = process.env.EMAIL_SMTP_PASS;
const emailTo = process.env.EMAIL_ADDRESS_TO;

/**
 * Palabras clave para buscar en la página
 */
const keywordsObjetivo = ['Servicio', 'Licencia', 'Web', 'Aplicación', 'Adobe', 'Nube'];

/**
 * Configuración del transporte de correo
 */
const transport = nodemailer.createTransport({
  service: 'gmail',
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

/**
 * Función para verificar si un correo ya ha sido enviado
 */
async function correoYaEnviado(nomenclatura, palabra, tipo) {
  const existe = await CorreosEnviados.findOne({
    where: { nomenclatura, palabra, tipo }
  });
  return !!existe;
}

/**
 * Función para enviar el correo cuando se encuentra una palabra clave
 */
async function enviarCorreo(tipo, palabra, registro) {

  const yaEnviado = await correoYaEnviado(registro.Nomenclatura, palabra, tipo);

  /**
   * Si el correo ya ha sido enviado, no se envía de nuevo
   */
  if (yaEnviado) {
    console.log(`⏩ Correo ya enviado previamente para "${palabra}" en ${tipo}, no se enviará de nuevo.`);
    return;
  }

  /**
   * Configuración del correo que se enviará
   */
  const mailOptions = {
    from: emailUser,
    to: emailTo,
    subject: 'Palabra encontrada',
    html: `<head>
    <style type="text/css">
      body {
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        -webkit-font-smoothing: antialiased !important;
      }
      img {
        border: 0 !important;
        outline: none !important;
      }
      p {
        margin: 0px !important;
        padding: 0px !important;
      }
      table {
        border-collapse: collapse;
        mso-table-lspace: 0px;
        mso-table-rspace: 0px;
      }
      td,
      a,
      span {
        border-collapse: collapse;
        mso-line-height-rule: exactly;
      }
      .ExternalClass * {
        line-height: 100%;
      }
      span.MsoHyperlink {
        mso-style-priority: 99;
        color: inherit;
      }
      span.MsoHyperlinkFollowed {
        mso-style-priority: 99;
        color: inherit;
      }
    </style>
    <style
      media="only screen and (min-width:481px) and (max-width:599px)"
      type="text/css"
    >
      @media only screen and (min-width: 481px) and (max-width: 599px) {
        table[class="em_main_table"] {
          width: 100% !important;
        }
        table[class="em_wrapper"] {
          width: 100% !important;
        }
        td[class="em_hide"],
        br[class="em_hide"] {
          display: none !important;
        }
        img[class="em_full_img"] {
          width: 100% !important;
          height: auto !important;
        }
        td[class="em_align_cent"] {
          text-align: center !important;
        }
        td[class="em_aside"] {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        td[class="em_height"] {
          height: 20px !important;
        }
        td[class="em_font"] {
          font-size: 14px !important;
        }
        td[class="em_align_cent1"] {
          text-align: center !important;
          padding-bottom: 10px !important;
        }
      }
    </style>
    <style media="only screen and (max-width:480px)" type="text/css">
      @media only screen and (max-width: 480px) {
        table[class="em_main_table"] {
          width: 100% !important;
        }
        table[class="em_wrapper"] {
          width: 100% !important;
        }
        td[class="em_hide"],
        br[class="em_hide"],
        span[class="em_hide"] {
          display: none !important;
        }
        img[class="em_full_img"] {
          width: 100% !important;
          height: auto !important;
        }
        td[class="em_align_cent"] {
          text-align: center !important;
        }
        td[class="em_align_cent1"] {
          text-align: center !important;
          padding-bottom: 10px !important;
        }
        td[class="em_height"] {
          height: 20px !important;
        }
        td[class="em_aside"] {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        td[class="em_font"] {
          font-size: 14px !important;
          line-height: 28px !important;
        }
        span[class="em_br"] {
          display: block !important;
        }
      }
    </style>
  </head>
  <body style="margin: 0px; padding: 0px" bgcolor="#ffffff">
    <table
      border="0"
      width="640"
      cellspacing="0"
      cellpadding="0"
      bgcolor="#ffffff"
      align="center"
    >
      <tr>
        <td align="center" valign="top" bgcolor="#ffffff">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            align="center"
            class="em_main_table"
            style="table-layout: fixed"
          >

            <tr>
              <td height="30" class="em_height">&nbsp;</td>
            </tr>

            <tr>
              <td
                height="1"
                bgcolor="#d8e4f0"
                style="font-size: 0px; line-height: 0px"
              ></td>
            </tr>

            <tr>
              <td height="41" class="em_height">&nbsp;</td>
            </tr>

            <tr>
              <td
                style="
                  font-family: 'Open Sans', Arial, sans-serif;
                  font-size: 15px;
                  line-height: 22px;
                  color: #000000;
                "
              >
                Saludos,<br />
                <br />
                Informamos que encontramos una palabra clave en el sitio web de <a href="${scrapingUrl}" style="color: #000000; font-weight: bold">SEACE</a>
                <ul>
                  <li>Palabra: <strong>${palabra}</strong></li>
                  <li>Descripción: <strong>${JSON.stringify(registro.Descripcion_Objetivo)}</strong></li>
                  <li>Fecha: <strong>${JSON.stringify(registro.Fecha_Publicacion)}</strong></li>
                </ul>
                Este mensaje se envía automáticamente, no se requiere ninguna acción.<br /> 
              </td>
            </tr>

            <tr>
              <td height="41" class="em_height">&nbsp;</td>
            </tr>

            <tr>
              <td
                height="1"
                bgcolor="#d8e4f0"
                style="font-size: 0px; line-height: 0px"
              ></td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td align="center" valign="top" bgcolor="#0000" class="em_aside">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            align="center"
            class="em_main_table"
            style="table-layout: fixed"
          >
            <tr>
              <td height="10" class="em_height"></td>
            </tr>
            <tr>
              <td
                align="center"
                style="
                  font-family: 'Open Sans', Arial, sans-serif;
                  font-size: 12px;
                  line-height: 18px;
                  color: #a0a1a1;
                  text-transform: uppercase;
                "
              >
                Gmedia © 2024. Todos los derechos reservados.
                <span style="text-decoration: underline"> </span>
              </td>
            </tr>
            <tr>
              <td height="10" class="em_height"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`
  };

  /**
   * Enviando el correo de alerta
   */
  try {
    await transport.sendMail(mailOptions);
    console.log('📨 Correo enviado');
    await CorreosEnviados.create({
      nomenclatura: registro.Nomenclatura,
      palabra,
      tipo,
    });
  } catch (error) {
    console.error('❌ Error al enviar el correo:', error);
  }
}

/** 
 * Función para buscar las palabras claves en los registros 
 */
async function buscarPalabrasClave(registros) {
  for (const registro of registros) {

    const palabraEncontradaObjetivo = keywordsObjetivo.find(keyword =>
      registro.Descripcion_Objetivo.includes(keyword)
    );

    if (palabraEncontradaObjetivo) {
      console.log(`🔹 Se encontró "${palabraEncontradaObjetivo}" en Descripcion_Objetivo: ${registro.Descripcion_Objetivo}`);
      await enviarCorreo('Descripcion_Objetivo', palabraEncontradaObjetivo, registro);
    }
  }
}

/**
 * Función principal para realizar el scraping
 */
(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/snap/bin/chromium', 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();

  const url = scrapingUrl;
  await page.goto(url, { waitUntil: 'networkidle2' });

  try {
    console.log('🕵️‍♂️ Iniciando la extracción de datos...');

    // Esperar a que cargue el filtro de años
    await page.waitForSelector('select#tbBuscador\\:idFormBuscarProceso\\:anioConvocatoria_input'); 

    // Cambiar el año en el filtro
    await page.select('select#tbBuscador\\:idFormBuscarProceso\\:anioConvocatoria_input', '2025'); 

    // Simular clic en el botón de búsqueda si es necesario
    await page.click('button#tbBuscador\\:idFormBuscarProceso\\:btnBuscarSelToken');
    
    // Esperar a que aparezca el selector de paginación
    await page.waitForSelector('select.ui-paginator-rpp-options');

    // Seleccionar 20 entradas en el select
    await page.select('select.ui-paginator-rpp-options', '20');

    // Esperar a que se actualice la tabla
    await page.waitForSelector('div.ui-datatable-tablewrapper > table > tbody > tr:not(.ui-datatable-empty-message)');

    // Extraer datos de la tabla
    const tableData = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('div.ui-datatable-tablewrapper > table > tbody > tr'));
      return rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));

        return {
            Nombre_Entidad: cells[1]?.textContent.trim() || '',
            Fecha_Publicacion: cells[2]?.textContent.trim() || '',
            Nomenclatura: cells[3]?.textContent.trim() || '',
            Reiniciado_Desde: cells[4]?.textContent.trim() || '',
            Objeto_Contratacion: cells[5]?.textContent.trim() || '',
            Descripcion_Objetivo: cells[6]?.textContent.trim() || '',
            Codigo_SNIP: cells[7]?.textContent.trim() || '',
            Codigo_Unico: cells[8]?.textContent.trim() || '',
            Valor_Re_Es: cells[9]?.textContent.trim() || '',
            Moneda: cells[10]?.textContent.trim() || '',
            SEACE: cells[11]?.textContent.trim() || ''
        };
      });
    });

    if (tableData.length === 0) {
        console.log('❌ No se encontraron datos en la tabla.');
        return;
    } 

    buscarPalabrasClave(tableData);

    const nomenclaturasGuardadas = new Set((await Datos.findAll({ attributes: ["Nomenclatura"] })).map((r) => r.Nomenclatura));

    const newRecords = tableData.filter((datos) => datos.Nomenclatura && !nomenclaturasGuardadas.has(datos.Nomenclatura));

    if (newRecords.length > 0) {
      console.log(`✅ Guardando ${newRecords.length} nuevos registros.`);
      await Datos.bulkCreate(newRecords);
    } else {
      console.log("⏩ No hay registros nuevos.");
    }
    

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();