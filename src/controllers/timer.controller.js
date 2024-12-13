const Timer = require('../models/Timer');
const TimerEvent = require('../models/TimerEvent');
const { sendNotification } = require('../utils/mailer');

// Iniciar un nuevo temporizador
const startTimer = async (req, res) => {
  try {
    const timer = await Timer.create({
      startTime: new Date()
    });

    await TimerEvent.create({
      type: 'START',
      timerId: timer.id
    });

    res.json({ success: true, timer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pausar el temporizador actual
const pauseTimer = async (req, res) => {
  try {
    const timer = await Timer.findOne({
      where: { endTime: null },
      order: [['createdAt', 'DESC']]
    });

    if (timer) {
      await TimerEvent.create({
        type: 'PAUSE',
        timerId: timer.id
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Detener el temporizador actual y verificar tiempo
const stopTimer = async (req, res) => {
  try {
    const timer = await Timer.findOne({
      where: { endTime: null },
      order: [['createdAt', 'DESC']]
    });

    if (timer) {
      const endTime = new Date();
      const startTime = new Date(timer.startTime);
      const diffHours = (endTime - startTime) / (1000 * 60 * 60);

      await timer.update({
        endTime,
        notificationSent: diffHours >= 8 // Marca como enviado si cumple las 8 horas
      });

      await TimerEvent.create({
        type: 'STOP',
        timerId: timer.id
      });

      // if (diffHours >= 8 && !timer.notificationSent) {
      //   await sendNotification(startTime, endTime);
      //   await timer.update({ notificationSent: true });
      // }

      await timer.update({ notificationSent: true });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Enviar notificación manual
const sendManualNotification = async (req, res) => {
  try {
    const timer = await Timer.findOne({
      where: { endTime: null },
      order: [['createdAt', 'DESC']]
    });

    if (timer) {
      const currentTime = new Date();
      await sendNotification(timer.startTime, currentTime);
      res.json({ success: true, message: 'Notification sent successfully' });
    } else {
      res.status(404).json({ error: 'No active timer found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // Verifica automáticamente los temporizadores activos y envía notificaciones
const checkTimers = async () => {
  try {
    const activeTimers = await Timer.findAll({
      where: {
        endTime: null, // Temporizadores activos
        notificationSent: false // Notificaciones no enviadas
      }
    });

    const now = new Date();

    for (const timer of activeTimers) {
      const startTime = new Date(timer.startTime);
      const diffHours = (now - startTime) / (1000 * 60 * 60); // Diferencia en horas

      if (diffHours >= 8) {
        console.log(`Enviando notificación para el temporizador ${timer.id}`);

        await sendNotification(startTime, now);
        await timer.update({ notificationSent: true }); // Marca como enviado
      }
    }
  } catch (error) {
    console.error('Error verificando temporizadores:', error);
  }
};

// Verifica automáticamente los temporizadores activos y envía notificaciones después de 4 segundos de haber iniciado
// const checkTimers = async () => {
//   console.log('checkTimers...')
//   try {
//     const activeTimers = await Timer.findAll({
//       where: {
//         endTime: null, // Temporizadores activos
//         notificationSent: false // Notificaciones no enviadas
//       }
//     });

//     const now = new Date();

//     for (const timer of activeTimers) {
//       const startTime = new Date(timer.startTime);
//       const diffSeconds = (now - startTime) / 1000; // Diferencia en segundos

//       if (diffSeconds >= 4) {
//         console.log(`Enviando notificación para el temporizador ${timer.id}`);

//         await sendNotification(startTime, now);        
//       }
//     }
//   } catch (error) {
//     console.error('Error verificando temporizadores:', error);
//   }
// };


// Configura la verificación automática cada minuto
setInterval(checkTimers, 2000); // Ejecuta cada 60 segundos

module.exports = {
  startTimer,
  pauseTimer,
  stopTimer,
  sendManualNotification,
  checkTimers
};
