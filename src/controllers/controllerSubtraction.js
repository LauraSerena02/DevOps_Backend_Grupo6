const { dataSource } = require('../database');
const dotenv = require('dotenv');
const income = require('../entities/entityIncome.js');
const expense = require('../entities/entityExpense.js');
const expenseCategory = require("../entities/entityExpenseCategory");
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

const getFinancialSummary = async (req, res) => {
    try {
        const userId = jwt.decode(req.headers["authorization"]).userId;

        // Obtener fechas desde req.query
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Las fechas de inicio y fin son obligatorias." });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Todo el dia

        if (isNaN(start) || isNaN(end) || start > end) {
            return res.status(400).json({ message: "Las fechas proporcionadas no son válidas." });
        }

        // Obtener el presupuesto desde req.body
        const { budgetedExpense } = req.query;

        // Repositorios de ingresos y gastos
        const incomeRepository = dataSource.getRepository(income);
        const expenseRepository = dataSource.getRepository(expense);

        // Obtener los ingresos dentro del rango de fechas
        const incomes = await incomeRepository.find({ where: { userId, incomeDate: Between(start, end) } });
        const totalIncomes = incomes.reduce((sum, income) => sum + income.incomeAmount, 0);

        // Obtener los gastos dentro del rango de fechas (sin relaciones, usando el expenseCategoryId)
        const expenses = await expenseRepository.find({
            where: {
                userId,
                expenseDate: Between(start, end),
            },
        });

        // Obtener las categorías de gastos manualmente
        const expenseCategoryRepository = dataSource.getRepository(expenseCategory);
        const categories = await expenseCategoryRepository.find();

        // Crear un mapa de categorías por ID
        const categoryMap = categories.reduce((map, category) => {
            map[category.expenseCategoryId] = category.categoryName;
            return map;
        }, {});

        // Agrupar los gastos por categoría 
        const expensesByCategory = expenses.reduce((grouped, expense) => {
            const categoryName = categoryMap[expense.expenseCategoryId];

            if (!categoryName) {
                return grouped; // Si no encontramos la categoría, continuamos sin modificar el grupo
            }

            if (!grouped[categoryName]) {
                grouped[categoryName] = 0;
            }
            grouped[categoryName] += expense.expenseAmount;
            return grouped;
        }, {});

        // Calcular la suma total de los gastos agrupados por categoría
        const totalExpensesByCategory = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

        // Calcular la diferencia entre ingresos y gastos totales
        const subtract = totalIncomes - totalExpensesByCategory;

        /// Calcular el excedente en gastos  si budgetedExpense es mayor que 0
        const overExpense = budgetedExpense > 0 
        ? totalExpensesByCategory - budgetedExpense 
        : 0;


        // Respuesta con los datos
        return res.json({
            totalIncomes,
            totalExpensesByCategory,
            expensesByCategory,
            subtract,
            budgetedExpense: parseFloat(budgetedExpense),
            overExpense,
        });
    } catch (error) {
        console.error("Error al procesar los datos:", error);
        res.status(500).json({ message: "Error al cargar los datos", error });
    }
};







module.exports = {getSubtract, getFinancialSummary};  