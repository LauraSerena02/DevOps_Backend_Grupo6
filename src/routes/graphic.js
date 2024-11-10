const express = require('express');
const { getFinancesByDateRange } = require('../controllers/controllerGraphic');
const router = express.Router();

// Define la ruta sin duplicación de '/graphic'
router.get('/', getFinancesByDateRange);

module.exports = router;
