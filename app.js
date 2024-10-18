const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const flash = require('connect-flash');

// Rutas
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const tallerRouter = require('./routes/taller');
 // Asegúrate de que la ruta sea correcta

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Configuración del motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Agregar el middleware de registro
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
  secret: 'mi_secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Middleware para cargar los datos del usuario


// Usar las rutas
app.use('/', indexRouter);
app.use('/users', usersRouter); 
app.use('/taller', tallerRouter); 
// Asegúrate de que los datos del usuario se carguen antes de llegar a la ruta de préstamos

// Ruta de perfil
app.get('/profile', (req, res) => { 
  if (!req.session.loggedin) {
      return res.redirect('/login');
  }
  res.render('profile', { 
      userId: req.session.userId, 
      username: req.session.username, 
      userEmail: req.session.userEmail 
  });
});

// Manejo de errores
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});
app.use(flash());

// Middleware para pasar mensajes a la vista
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// En tu controlador
app.post('/users/perfil', (req, res) => {
  // Lógica para guardar datos
  let success_msg = '';
  let error_msg = '';

  if (dataSavedSuccessfully) {
      success_msg = 'Datos guardados correctamente';
  } else {
      error_msg = 'Error al guardar los datos';
  }

  res.render('profile', { success_msg, error_msg });
});

console.log('Inicio del servidor');

module.exports = app;
