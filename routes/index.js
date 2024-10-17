const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Importar la conexión de la base de datos desde db.js
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Ruta para mostrar el formulario de registro
router.get('/register', function(req, res) {
  res.render('register', { title: 'Registro' });
});

// Ruta para mostrar el dashboard
router.get('/dashboard', (req, res) => {
  if (req.session.loggedin) {
    res.render('dashboard', { username: req.session.username });
  } else {
    res.redirect('/');
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.redirect('/');
  });
});


// Ruta para perfil
router.get('/profile', (req, res) => {
  if (req.session.loggedin) {
    res.render('profile', { username: req.session.username });
  } else {
    res.redirect('/');
  }



  });
 

// Ruta para préstamos
router.get('/loans', (req, res) => {
  if (req.session.loggedin) {
    res.render('loans', { username: req.session.username });
  } else {
    res.redirect('/');
  }
});

// Ruta para devoluciones
router.get('/returns', (req, res) => {
  if (req.session.loggedin) {
    res.render('returns', { username: req.session.username });
  } else {
    res.redirect('/');
  }
});

// Ruta para mi QR
router.get('/my-qr', (req, res) => {
  if (req.session.loggedin) {
    res.render('my-qr', { username: req.session.username });
  } else {
    res.redirect('/');
  }
});

// Ruta para recomendaciones
router.get('/recommendations', (req, res) => {
  if (req.session.loggedin) {
    res.render('recommendations', { username: req.session.username });
  } else {
    res.redirect('/');
  }
});

module.exports = router;