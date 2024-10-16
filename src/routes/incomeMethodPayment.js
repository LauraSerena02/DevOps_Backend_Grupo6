const express = require('express');
const router = express.Router();//Permite crear los endpoints con sus respectivos metodos
const incomeMethodPayments = require('../controllers/controllerIncomeMethodPayment')

router.get('/incomeMethodPayments', incomeMethodPayments );

module.exports = router;