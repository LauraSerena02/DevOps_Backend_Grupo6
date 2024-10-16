const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/jwt')
const { createIncome } = require('../controllers/controllerIncome');

router.post('/createIncome/',checkToken, createIncome);

module.exports = router;