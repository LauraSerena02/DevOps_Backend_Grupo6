const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/jwt')
const { createIncome, getIncome, updateIncome, deleteIncome } = require('../controllers/controllerIncome');

router.post('/createIncome/',checkToken, createIncome);
router.get('/getIncome/',checkToken, getIncome);
router.post('/updateIncome/:incomeId', updateIncome);
router.post('/deleteIncome/:incomeId', deleteIncome);
module.exports = router;