// index.js
const app = require('./src/app');
const sequelize = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Conexión a la base de datos
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sincronización de la base de datos
    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    // Inicia el servidor
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
