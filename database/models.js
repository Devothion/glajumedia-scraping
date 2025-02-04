const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Datos = sequelize.define("Datos", {
  Nombre_Entidad: DataTypes.STRING,
  Fecha_Publicacion: DataTypes.STRING,
  Nomenclatura: {
    type: DataTypes.STRING,
    unique: true, // Evita duplicados
  },
  Reiniciado_Desde: DataTypes.STRING,
  Objeto_Contratacion: DataTypes.STRING,
  Descripcion_Objetivo: DataTypes.STRING,
  Codigo_SNIP: DataTypes.STRING,
  Codigo_Unico: DataTypes.STRING,
  Valor_Re_Es: DataTypes.STRING,
  Moneda: DataTypes.STRING,
  SEACE: DataTypes.STRING,
});

const CorreosEnviados = sequelize.define("CorreosEnviados", {
    nomenclatura: DataTypes.STRING,
    palabra: DataTypes.STRING,
    tipo: DataTypes.STRING,
  });
  
  sequelize.sync(); // Sincroniza los modelos con la base de datos
  
  module.exports = { Datos, CorreosEnviados };
  