// db.js
const mysql = require('mysql2/promise');

// Configuración de la conexión
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tecbox',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Función para probar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión exitosa a la base de datos');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}



// Exportar el pool de conexiones
module.exports = {
  pool,testConnection
};
