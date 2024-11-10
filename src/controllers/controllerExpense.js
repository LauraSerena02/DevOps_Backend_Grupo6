const { connection, dataSource } = require('../database');
const dotenv = require('dotenv');
const expense =require('../entities/entityExpense')
const expenseMethodPayment =require('../entities/entityExpenseMethodPayment');
const expenseCategory =require('../entities/entityExpenseCategory');
const jwt = require('jsonwebtoken');
const { Between } = require('typeorm');



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

const getExpense = async (req, res) => {
    try {
       
        const userId = jwt.decode(req.headers["authorization"]).userId;

        const {date, keyword} = req.query;

        let whereClause = { userId };

        const expenseRepository = dataSource.getRepository(expense);

        if(date){
            const startDate = new Date(date);
            startDate.setDate(startDate.getDate() + 1) 
            const endDate = new Date(startDate);             
            endDate.setHours(23, 59, 59, 999)
            startDate.setHours(0, 0, 0, 0)
            whereClause.expenseDate = Between(startDate, endDate);
        }

       
        
        // Obtener todos los ingresos asociados al userId
        const expenses = await expenseRepository.find({ where: whereClause });

        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ingresos para este usuario' });
        }

        const expenseCategoryRepo = dataSource.getRepository(expenseCategory);
        
      
        const expenseMethodPaymentRepo = dataSource.getRepository(expenseMethodPayment);
       
        const response = await Promise.all(
            expenses.map(async (expense) => {
                const expenseCategoryEntity = await expenseCategoryRepo.findOneBy({
                    expenseCategoryId: expense.expenseCategoryId,
                });

                const expenseMethodPaymentEntity = await expenseMethodPaymentRepo.findOneBy({
                    expenseMethodPaymentId: expense.expenseMethodPaymentId,
                });

                return {
                    expenseId : expense.expenseId,
                    expenseDate: expense.expenseDate,
                    expenseAmount: expense.expenseAmount,
                    expenseCategory: expenseCategoryEntity ? expenseCategoryEntity.categoryName : null,
                    expenseMethodPayment: expenseMethodPaymentEntity ? expenseMethodPaymentEntity.expenseMethodPaymentName : null,
                    expenseDescription: expense.expenseDescription,
                    type: "expense"
                };

                
            })

            
        );
       
        if(keyword){
            //const incomes = await incomeRepository.find({ where: { userId, incomeDescription : Like (`%${keyword}%`)  } });
            const filter = response.filter((expense)=>{
                if(expense.expenseCategory && expense.expenseCategory.toLowerCase().includes(keyword.toLowerCase())){

                    return true                    
                }
                if(expense.expenseMethodPayment && expense.expenseMethodPayment.toLowerCase().includes(keyword.toLowerCase())){

                    return true                    
                }
                if(expense.expenseDescription && expense.expenseDescription.toLowerCase().includes(keyword.toLowerCase())){

                    return true                    
                }
                return false

            })
            return res.json(filter);
        }


        return res.json(response);
    } catch (error) {
        console.error('Error al obtener los gastos:', error);
        res.status(500).json({ message: 'Error al obtener los gastos', error });
    }
};

const updateExpense = async (req, res) => {
    try {
        
        const { expenseId } = req.params; // ID pasado cómo parámetros.
        const data = req.body;
        const { expenseDate, expenseAmount, expenseCategoryId, expenseMethodPaymentId, expenseDescription} = data;
        
        // Verificar que todos los campos obligatorios están presentes, excepto la contraseña
        if (!expenseDate|| !expenseAmount || !expenseCategoryId || !expenseMethodPaymentId || !expenseDescription) {
            

            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        const expenseRepository = dataSource.getRepository("expense");
        const expense = await expenseRepository.findOneBy({ expenseId  });

        if (!expense) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }

        // Validar tipo de identificación
        const expenseCategoryRepository = dataSource.getRepository(expenseCategory);
        const expenseCategoryEntity = await expenseCategoryRepository.findOneBy({ expenseCategoryId });

        if (!expenseCategoryEntity) {
            return res.status(400).json({ message: 'Categoria no encontrada' });
        }

        // Validar país
        const expenseMethodPaymentRepository = dataSource.getRepository(expenseMethodPayment);
        const expenseMethodPaymentEntity = await expenseMethodPaymentRepository.findOneBy({ expenseMethodPaymentId });

        if (!expenseMethodPaymentEntity) {
            return res.status(400).json({ message: 'Método de pago no encontrado' });
        }
         
        // Actualizar campos
        expense.expenseDate = expenseDate;
        expense.expenseAmount = expenseAmount;
        expense.expenseCategoryId = expenseCategoryId;
        expense.expenseMethodPaymentId = expenseMethodPaymentId;
        expense.expenseDescription = expenseDescription;
        
        await expenseRepository.save(expense);
        return res.json({ msg: "Gasto actualizado" });

    } catch (error) {
        console.error('Error al actualizar el gasto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteExpense = async (req, res) => {
    try {
      const { expenseId } = req.params;
      if (!expenseId) {
        return res.status(400).json({ error: 'ID de gasto no proporcionado' });
      }
  
      const repository = dataSource.getRepository(expense);
  
      // Elimina la noticia de la base de datos
      await repository.delete({ expenseId });
  
      res.json({ msg: "Gasto eliminado correctamente" });
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
      res.status(500).json({ error: 'Error al eliminar el gasto' });
    }
  };


module.exports = {createExpense, getExpense, updateExpense, deleteExpense};