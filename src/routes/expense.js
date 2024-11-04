const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/jwt')
const { createExpense } = require('../controllers/controllerExpense');

router.post('/createExpense/',checkToken, createExpense);

module.exports = router;