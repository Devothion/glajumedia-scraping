const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nombre de la base de datos
  process.env.DB_USER, // Usuario
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false, // Desactiva logs de SQL
  }
);

sequelize.authenticate().then(() => {
  console.log("Conexión exitosa a la base de datos.");
}).catch((error) => {
  console.error("Error al conectar a la base de datos:", error);
});

module.exports = sequelize;