const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const multer = require('multer'); // Si usas multer, asegúrate de configurarlo correctamente
const axios = require('axios');  // Importa axios para realizar la solicitud HTTP

// Ruta para manejar el registro de usuario
router.post('/register', async (req, res) => {
  console.log('Solicitud POST a /users/register');
  const { Nombre, Email, Contraseña } = req.body;

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await db.query('SELECT * FROM registrar WHERE Email = ? OR Nombre= ? ', [ Email,Nombre]);

    if (existingUser.length > 0) {
      return res.status(400).send('El nombre de usuario o el correo electrónico ya están en uso');
    }

    // Verificar que se haya enviado una contraseña
    if (!Contraseña) {
      return res.status(400).send('La contraseña es obligatoria');
    }

    // Genera un salt con 10 rondas
    const salt = await bcrypt.genSalt(10);

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(Contraseña, salt);

    // Registrar el nuevo usuario
    const query = 'INSERT INTO registrar ( Email, Nombre, Contraseña) VALUES (?, ?, ?)';
    db.query(query, [ Email,Nombre, hashedPassword], (err, result) => {
  if (err) {
    console.error('Error al registrar el usuario:', err);
    return res.status(500).send('Error en el servidor');
  }

  res.send('Usuario registrado exitosamente');
  res.redirect('/dashboard');
  });

  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).send('Error en el servidor');
  }
   });

// Manejo del login
router.post('/auth', async (req, res) => {
  const { Email, Contraseña } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM registrar WHERE  Email = ?', [Email]);

    if (results.length > 0) {
      const comparison = await bcrypt.compare(Contraseña, results[0].Contraseña);
      if (comparison) {
        // Establecer los datos del usuario en la sesión
        req.session.loggedin = true;
        req.session.userId = results[0].ID_Registro;
        req.session.username = results[0].Nombre;
        req.session.userEmail = results[0].Email;
        
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


router.post('/perfil', async (req, res) => {
    const { nombre, email, nie, especialidad, ano } = req.body;
    const userId = req.session.userId; // Asumiendo que tienes el ID del usuario en la sesión


    try {
        // Verificar si ya existe un registro para el usuario
        const checkQuery = 'SELECT * FROM perfil_usuario WHERE id = ?';
        const [results] = await db.query(checkQuery, [userId]);

        if (results.length > 0) {
            // Si ya existe, actualizar los datos
            const updateQuery = 'UPDATE perfil_usuario SET nombre = ?, email = ?, nie = ?, especialidad = ?, ano_bachillerato = ? WHERE id = ?';
            await db.query(updateQuery, [nombre, email, nie, especialidad, ano, userId]);
            
        } else {
            // Si no existe, insertar un nuevo registro
            const insertQuery = 'INSERT INTO perfil_usuario (id, nombre, email, nie, especialidad, ano_bachillerato) VALUES (?, ?, ?, ?, ?, ?)';
            await db.query(insertQuery, [userId, nombre, email, nie, especialidad, ano]);
           
        }
    } catch (err) {
        console.error('Error al procesar la solicitud:', err);
        return res.status(500).send('Error al procesar la solicitud');
    }
});




module.exports = router;
     
