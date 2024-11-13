// Importa el objeto de conexión a la base de datos y la entidad tipo de ingresos
const { dataSource } = require('../database');
const incomeMethodPayment =require('../entities/entityIncomeMethodPayment');

// Define una función asíncrona para manejar la solicitud de tipos de ingresos
const incomeMethodPayments = async (req, res) => {
    try {
        // Obtiene el repositorio para la entidad 'incomeCategory'
      const incomeMethodPaymentRepository = dataSource.getRepository(incomeMethodPayment);
       // Realiza una consulta para obtener todos las tipos de categoria de ingresos
      const incomeMethodPayments = await incomeMethodPaymentRepository.find();
      // Envía una respuesta con el estado 200 y los datos de los tipos de identificacion en formato JSON
      res.status(200).json(incomeMethodPayments);
    } catch (error) {
        // Si ocurre un error, lo registra en la consola 
      //console.error('Error al recuperar los metodos de pago de ingresos', error);
      // Envía una respuesta con el estado 500 y un mensaje de error
      res.status(500).json({ error: 'Error al recuperar los metodos de pago de ingresos' });
    }
  };
    // Exporta la función para que pueda ser utilizada en otros módulos
  module.exports = incomeMethodPayments;  
