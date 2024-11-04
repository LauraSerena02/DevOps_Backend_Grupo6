const { connection, dataSource } = require('../database');
const dotenv = require('dotenv');
const expense =require('../entities/entityExpense')
const expenseMethodPayment =require('../entities/entityExpenseMethodPayment');
const expenseCategory =require('../entities/entityExpenseCategory');
const jwt = require('jsonwebtoken');



const createExpense = async (req, res) => {
    try {
        //Deben mandar el token por cabecera authorization
        const userId = jwt.decode(req.headers["authorization"]).userId; // ID del usuario de los parámetros de la URL
        const data = req.body
        const {expenseDate, expenseAmount, expenseMethodPaymentId, expenseCategoryId, expenseDescription} = data;
        

        // Verificar que todos los campos necesarios están presentes
        if (!expenseDate|| !expenseAmount || !expenseMethodPaymentId || !expenseCategoryId || !expenseDescription) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        const expense= {expenseDate, expenseAmount, expenseMethodPaymentId, expenseCategoryId, expenseDescription, userId};

        const expenseMethodPaymentRepository = dataSource.getRepository(expenseMethodPayment)
        const expenseMethodPaymentEntity = await expenseMethodPaymentRepository.findOne({ where: { expenseMethodPaymentId: expenseMethodPaymentId } });

        if (!expenseMethodPaymentEntity) {
            return res.status(400).json({ message: 'Tipo de método de pago no encontrado' });
        }

        const expenseCategoryRepository = dataSource.getRepository(expenseCategory)
        const expenseCategoryEntity = await expenseCategoryRepository.findOne({ where: { expenseCategoryId: expenseCategoryId } });

        if (!expenseCategoryEntity) {
            return res.status(400).json({ message: 'Categoria de ingreso no encontrada' });
        }
        const repositorio = dataSource.getRepository("expense");
        
        await repositorio.save(expense)
        res.json({ msg: "gasto agregado"});

    } catch (error) {
        console.error('Error al ingresar el gasto:', error);
        res.status(400).json({ error: ''});
    }
}

module.exports = {createExpense};