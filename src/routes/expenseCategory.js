const express = require('express');
const router = express.Router();//Permite crear los endpoints con sus respectivos metodos
const expenseCategories = require('../controllers/controllerExpenseCategory')

router.get('/expenseCategories', expenseCategories );

module.exports = router;