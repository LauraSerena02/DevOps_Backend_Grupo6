// Importa el objeto de conexión a la base de datos y la entidad tipo de ingresos
const { dataSource } = require('../database');
const expenseMethodPayment =require('../entities/entityExpenseMethodPayment');

// Define una función asíncrona para manejar la solicitud de tipos de ingresos
const expenseMethodPayments = async (req, res) => {
    try {
        // Obtiene el repositorio para la entidad 'incomeCategory'
      const expenseMethodPaymentRepository = dataSource.getRepository(expenseMethodPayment);
       // Realiza una consulta para obtener todos las tipos de categoria de ingresos
      const expenseMethodPayments = await expenseMethodPaymentRepository.find();
      // Envía una respuesta con el estado 200 y los datos de los tipos de identificacion en formato JSON
      res.status(200).json(expenseMethodPayments);
    } catch (error) {
        // Si ocurre un error, lo registra en la consola 
      console.error('Error al recuperar los metodos de pago de ingresos', error);
      // Envía una respuesta con el estado 500 y un mensaje de error
      res.status(500).json({ error: 'Error al recuperar los metodos de pago de ingresos' });
    }
  };
    // Exporta la función para que pueda ser utilizada en otros módulos
  module.exports = expenseMethodPayments;  