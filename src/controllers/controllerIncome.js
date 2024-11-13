const { connection, dataSource } = require('../database');
const dotenv = require('dotenv');
const income =require('../entities/entityIncome')
const incomeMethodPayment =require('../entities/entityIncomeMethodPayment');
const incomeCategory =require('../entities/entityIncomeCategory');
const jwt = require('jsonwebtoken');



const createIncome = async (req, res) => {
    try {
        //Deben mandar el token por cabecera authorization
        const userId = jwt.decode(req.headers["authorization"]).userId; // ID del usuario de los parámetros de la URL
        const data = req.body
        const {incomeDate, incomeAmount, incomeMethodPaymentId, incomeCategoryId, incomeDescription} = data;
        

        // Verificar que todos los campos necesarios están presentes
        if (!incomeDate|| !incomeAmount || !incomeMethodPaymentId || !incomeCategoryId || !incomeDescription) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        const income= {incomeDate, incomeAmount, incomeMethodPaymentId, incomeCategoryId, incomeDescription, userId};

        const incomeMethodPaymentRepository = dataSource.getRepository(incomeMethodPayment)
        const incomeMethodPaymentEntity = await incomeMethodPaymentRepository.findOne({ where: { incomeMethodPaymentId: incomeMethodPaymentId } });

        if (!incomeMethodPaymentEntity) {
            return res.status(400).json({ message: 'Tipo de método de pago no encontrado' });
        }

        const incomeCategoryRepository = dataSource.getRepository(incomeCategory)
        const incomeCategoryEntity = await incomeCategoryRepository.findOne({ where: { incomeCategoryId: incomeCategoryId } });

        if (!incomeCategoryEntity) {
            return res.status(400).json({ message: 'Categoria de ingreso no encontrada' });
        }
        const repositorio = dataSource.getRepository("income");
        
        await repositorio.save(income)
        res.json({ msg: "ingreso agregado"});

    } catch (error) {
        console.error('Error al ingresar el ingreso:', error);
        res.status(400).json({ error: ''});
    }
}

module.exports = {createIncome};
