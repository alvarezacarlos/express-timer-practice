const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendNotification = async (startTime, endTime) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: '¡8 horas completadas!',
      html: `
        <h1>Tiempo completado</h1>
        <p>El cronómetro ha alcanzado las 8 horas.</p>
        <p>Inicio: ${startTime}</p>
        <p>Fin: ${endTime}</p>
      `
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendNotification };