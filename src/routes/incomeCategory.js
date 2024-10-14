const express = require('express');
const router = express.Router();//Permite crear los endpoints con sus respectivos metodos
const incomeCategories = require('../controllers/controllerIncomeCategory')

router.get('/incomeCategories', incomeCategories );

module.exports = router;