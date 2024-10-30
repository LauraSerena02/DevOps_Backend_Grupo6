const express = require('express');
const router = express.Router();//Permite crear los endpoints con sus respectivos metodos
const expenseMethodPayments = require('../controllers/controllerExpenseMethodPayment')

router.get('/expenseMethodPayments', expenseMethodPayments);

module.exports = router;