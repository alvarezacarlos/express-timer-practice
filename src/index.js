const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const Timer = require('./models/Timer'); // Importamos el modelo Timer
require('dotenv').config();

const timerRoutes = require('./routes/timer.routes');
const viewRoutes = require('./routes/view.routes');

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

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Sincronizar la base de datos
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();