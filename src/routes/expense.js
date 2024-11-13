const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/jwt')
const { createExpense, getExpense, updateExpense, deleteExpense } = require('../controllers/controllerExpense');

router.post('/createExpense/',checkToken, createExpense);
router.get('/getExpense/',checkToken, getExpense);
router.post('/updateExpense/:expenseId', updateExpense);
router.post('/deleteExpense/:expenseId', deleteExpense);

module.exports = router;