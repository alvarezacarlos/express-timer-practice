const express = require('express');
const router = express.Router();
const timerController = require('../controllers/timer.controller');

router.post('/start', timerController.startTimer);
router.post('/pause', timerController.pauseTimer);
router.post('/stop', timerController.stopTimer);
router.post('/send-notification', timerController.sendManualNotification);

module.exports = router;