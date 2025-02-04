# 🚀 Proyecto de Web Scraping con Puppeteer y Sequelize  

## 📌 Descripción  
Este proyecto realiza **web scraping** utilizando **Puppeteer** para extraer datos de un sitio web y almacenarlos en una base de datos MySQL mediante **Sequelize ORM**.  
Además, **envía correos electrónicos** de alerta cuando detecta palabras clave en los datos extraídos.  

## 🛠️ Tecnologías y Dependencias  
Este proyecto usa las siguientes dependencias:  

```json
"dependencies": {
  "dotenv": "^16.4.7",
  "mysql2": "^3.12.0",
  "nodemailer": "^6.10.0",
  "puppeteer": "^24.1.1",
  "sequelize": "^6.37.5"
}
```

## 📂 Estructura del Proyecto  

- 📁 glajumedia-scraping
  - 📁 database
    - 📄 database.js
    - 📄 models.js
  - 📁 node_modules
  - 📄 .env
  - 📄 .gitignore
  - 📄 app.js
  - 📄 package-lock.json
  - 📄 package.json
  - 📄 README.md

## ⚙️ Configuración

1️⃣ Instalar dependencias: Ejecuta el siguiente comando en la terminal:

```bash
npm install
```

2️⃣ Configurar el archivo .env

```ini
DB_HOST=tu_host_mysql
DB_PORT=3306
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
SCRAPING_URL=https://ejemplo.com
EMAIL_ENABLED=true
EMAIL_SMTP_USER=tu_correo@gmail.com
EMAIL_SMTP_PASS=tu_contraseña
EMAIL_ADDRESS_TO=destinatario@correo.com
```

## 🚀 Ejecución del Scraper
Para ejecutar el scraper, usa el siguiente comando:

```bash
npm run start
```
Este script extrae datos, los guarda en la base de datos y envía alertas si encuentra palabras clave.

## ⏲️ Automatización del Scraping
Para ejecutar el scraper de forma automática, se recomienda utilizar **PM2** o **node-cron**:

### 🟢 Opción 1: Usar PM2  
**PM2** permite ejecutar y administrar procesos en segundo plano.  

```bash
pm2 start app.js --cron "*/1 * * * *" --name scraping-job
```

### 🟢 Opción 2: Usar node-cron
Si prefieres ejecutar el scraping a intervalos definidos, usa node-cron.

```js
const cron = require('node-cron');
cron.schedule('0 * * * *', () => {
  console.log('⏳ Ejecutando scraping...');
  require('./app');
});
```

## 📜 Licencia
Este proyecto se distribuye bajo la licencia **MIT**.
