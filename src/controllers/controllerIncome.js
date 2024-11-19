const { connection, dataSource } = require('../database');
const dotenv = require('dotenv');
const income =require('../entities/entityIncome')
const incomeMethodPayment =require('../entities/entityIncomeMethodPayment');
const incomeCategory =require('../entities/entityIncomeCategory');
const jwt = require('jsonwebtoken');
const {generateToken, decodeToken} = require("../utils/jwt");
const { Between } = require('typeorm');



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

const getIncome = async (req, res) => {
    try {
       
        const userId = jwt.decode(req.headers["authorization"]).userId;

        const {date, keyword} = req.query;

        let whereClause = { userId };

        const incomeRepository = dataSource.getRepository(income);

        if(date){
            const startDate = new Date(date);
            const endDate = new Date(date);
            startDate.setUTCHours(0, 0, 0, 0); // Inicio del día en UTC
            endDate.setUTCHours(23, 59, 59, 999); // Final del día en UTC
            whereClause.incomeDate = Between(startDate, endDate);
        }


        
        // Obtener todos los ingresos asociados al userId
        const incomes = await incomeRepository.find({ where:  whereClause  });

        if (incomes.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ingresos para este usuario' });
        }

        const incomeCategoryRepo = dataSource.getRepository(incomeCategory);
        
      
        const incomeMethodPaymentRepo = dataSource.getRepository(incomeMethodPayment);
       
        const response = await Promise.all(
            incomes.map(async (income) => {
                const incomeCategoryEntity = await incomeCategoryRepo.findOneBy({
                    incomeCategoryId: income.incomeCategoryId,
                });

                const incomeMethodPaymentEntity = await incomeMethodPaymentRepo.findOneBy({
                    incomeMethodPaymentId: income.incomeMethodPaymentId,
                });

                return {
                    incomeId : income.incomeId,
                    incomeDate: income.incomeDate,
                    incomeAmount: income.incomeAmount,
                    incomeCategory: incomeCategoryEntity ? incomeCategoryEntity.incomeName : null,
                    incomeMethodPayment: incomeMethodPaymentEntity ? incomeMethodPaymentEntity.incomeMethodPaymentName : null,
                    incomeDescription: income.incomeDescription,
                    type: "income",
                    incomeCategoryId: incomeCategoryEntity ? incomeCategoryEntity.incomeCategoryId: null,
                    incomeMethodPaymentId: incomeMethodPaymentEntity ? incomeMethodPaymentEntity.incomeMethodPaymentId: null
                };

                
            })

            
        );
       
        if(keyword){
            //const incomes = await incomeRepository.find({ where: { userId, incomeDescription : Like (`%${keyword}%`)  } });
            const filter = response.filter((income)=>{
                if(income.incomeCategory && income.incomeCategory.toLowerCase().includes(keyword.toLowerCase())){

                    return true                    
                }
                if(income.incomeMethodPayment && income.incomeMethodPayment.toLowerCase().includes(keyword.toLowerCase())){

                    return true                    
                }
                if(income.incomeDescription && income.incomeDescription.toLowerCase().includes(keyword.toLowerCase())){

                    return true                    
                }
                return false

            })
            return res.json(filter);
        }


        return res.json(response);
    } catch (error) {
        console.error('Error al obtener los ingresos:', error);
        res.status(500).json({ message: 'Error al obtener los ingresos', error });
    }
};

const updateIncome = async (req, res) => {
    try {
        
        const { incomeId } = req.params; // ID pasado cómo parámetros.
        const data = req.body;
        const { incomeDate, incomeAmount, incomeCategoryId, incomeMethodPaymentId, incomeDescription} = data;
        
        // Verificar que todos los campos obligatorios están presentes
        if (!incomeDate|| !incomeAmount || !incomeCategoryId || !incomeMethodPaymentId || !incomeDescription) {
            

            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        const incomeRepository = dataSource.getRepository("income");
        const income = await incomeRepository.findOneBy({ incomeId  });

        if (!income) {
            return res.status(404).json({ message: 'Ingreso no encontrado' });
        }

        // Validar tipo de identificación
        const incomeCategoryRepository = dataSource.getRepository(incomeCategory);
        const incomeCategoryEntity = await incomeCategoryRepository.findOneBy({ incomeCategoryId });

        if (!incomeCategoryEntity) {
            return res.status(400).json({ message: 'Categoria no encontrada' });
        }

        // Validar país
        const incomeMethodPaymentRepository = dataSource.getRepository(incomeMethodPayment);
        const incomeMethodPaymentEntity = await incomeMethodPaymentRepository.findOneBy({ incomeMethodPaymentId });

        if (!incomeMethodPaymentEntity) {
            return res.status(400).json({ message: 'Método de pago no encontrado' });
        }
         
        // Actualizar campos
        income.incomeDate = incomeDate;
        income.incomeAmount = incomeAmount;
        income.incomeCategoryId = incomeCategoryId;
        income.incomeMethodPaymentId = incomeMethodPaymentId;
        income.incomeDescription = incomeDescription;
        
        await incomeRepository.save(income);
        return res.json({ msg: "Ingreso actualizado" });

    } catch (error) {
        console.error('Error al actualizar el ingreso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteIncome = async (req, res) => {
    try {
      const { incomeId } = req.params;
      if (!incomeId) {
        return res.status(400).json({ error: 'ID de ingreso no proporcionado' });
      }
  
      const repository = dataSource.getRepository(income);
  
      // Elimina la noticia de la base de datos
      await repository.delete({ incomeId });
  
      res.json({ msg: "Ingreso eliminado correctamente" });
    } catch (error) {
      console.error('Error al eliminar el ingreso:', error);
      res.status(500).json({ error: 'Error al eliminar el ingreso' });
    }
  };
  
  

module.exports = {createIncome, getIncome, updateIncome, deleteIncome};
