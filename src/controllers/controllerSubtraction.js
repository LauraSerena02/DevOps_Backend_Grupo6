const { dataSource } = require('../database');
const dotenv = require('dotenv');
const income = require('../entities/entityIncome.js');
const expense = require('../entities/entityExpense.js');
const jwt = require('jsonwebtoken');
const { Between } = require('typeorm');

dotenv.config();


const getSubtract = async (req, res) => {

    try {
        const userId = jwt.decode(req.headers["authorization"]).userId;
    const startDate = new Date();
    startDate.setDate(1); // Establece el día en 1
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Avanza al siguiente mes
    endDate.setDate(0); // Establece el día en 0, que corresponde al último día del mes anterior
    endDate.setHours(23, 59, 59, 999);

    const incomeRepository = dataSource.getRepository(income);
    const incomes = await incomeRepository.find({ where: { userId, incomeDate: Between(startDate, endDate) } });
    const expenseRepository = dataSource.getRepository(expense);
    const expenses = await expenseRepository.find({ where: { userId, expenseDate: Between(startDate, endDate) } });
    
    let totalIncomes = 0
    let totalExpenses = 0
    let subtract = 0

    incomes.forEach((incomeElement)=>{
        totalIncomes = totalIncomes + incomeElement.incomeAmount
    })

    expenses.forEach((expenseElement)=>{
        totalExpenses = totalExpenses + expenseElement.expenseAmount
    })

    subtract = totalIncomes - totalExpenses
    return res.json({
        totalExpenses,totalIncomes,subtract
    })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al cargar ', error });
    }
    
    
};

module.exports = {getSubtract};  