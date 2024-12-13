const express = require('express');
const router = express.Router();
const Timer = require('../models/Timer');

router.get('/', async (req, res) => {
  try {
    // Obtener el último timer activo si existe
    const activeTimer = await Timer.findOne({
      where: { endTime: null },
      order: [['createdAt', 'DESC']]
    });

    res.render('index', { activeTimer });
  } catch (error) {
    console.error('Error rendering index:', error);
    res.status(500).render('error', { error: 'Internal Server Error' });
  }
});

module.exports = router;