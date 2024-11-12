const express = require('express');
const { getFinancesByDateRange } = require('../controllers/controllerGraphic');
const { checkToken } = require('../middleware/jwt')
const router = express.Router();

// Define la ruta sin duplicación de '/graphic'
router.get('/',checkToken, getFinancesByDateRange);

module.exports = router;
