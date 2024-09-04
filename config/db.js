// config/db.js
const mysql = require('mysql2/promise');

// Crear una conexión a la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tci'
});

module.exports = connection;

