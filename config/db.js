const mysql = require('mysql2/promise');

// Crear una conexión a la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'taller'
});

// Exportar la conexión
module.exports = db;


