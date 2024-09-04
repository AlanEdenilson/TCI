const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Ruta para manejar el registro de usuario
router.post('/register', async (req, res) => {
  console.log('Solicitud POST a /users/register');
  const { username, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

    if (existingUser.length > 0) {
      return res.status(400).send('El nombre de usuario o el correo electrónico ya están en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Registrar el nuevo usuario
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        return res.status(500).send('Error en el servidor');
      }

      res.send('Usuario registrado exitosamente');
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Manejo del login
router.post('/auth', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Consultar el usuario por nombre de usuario o correo electrónico
    const [results] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

    if (results.length > 0) {
      const comparison = await bcrypt.compare(password, results[0].password);
      if (comparison) {
        req.session.loggedin = true;
        req.session.username = results[0].username;
        res.redirect('/dashboard');
      } else {
        res.send('Usuario o contraseña incorrecta.');
      }
    } else {
      res.send('Usuario no encontrado.');
    }
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).send('Error en el servidor');
  }
});

const multer = require('multer');

// Ruta para el perfil
router.get('/profile', (req, res) => {
  if (req.session.loggedin) {
    // Obtener la información del usuario desde la base de datos
    db.query('SELECT * FROM users WHERE username = ?', [req.session.username], (err, results) => {
      if (err) {
        console.error('Error en la consulta a la base de datos:', err);
        return res.status(500).send('Error en el servidor');
      }

      if (results.length > 0) {
        const user = results[0];
        console.log('Usuario obtenido:', user);
        res.render('profile', { user: user });
      } else {
        res.status(404).send('Usuario no encontrado');
      }
    });
  } else {
    res.redirect('/index');
  }
});



module.exports = router;
