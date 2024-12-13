// src/app.js
const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const timerRoutes = require('./routes/timer.routes');
const viewRoutes = require('./routes/view.routes');
require('dotenv').config();

const app = express();

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', viewRoutes);
app.use('/api/timer', timerRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Exporta la aplicación para usarla en otro lugar
module.exports = app;
