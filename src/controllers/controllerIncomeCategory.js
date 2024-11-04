// Importa el objeto de conexión a la base de datos y la entidad tipo de ingresos
const { dataSource } = require('../database');
const incomeCategory =require('../entities/entityIncomeCategory');

// Define una función asíncrona para manejar la solicitud de tipos de ingresos
const incomeCategories = async (req, res) => {
    try {
        // Obtiene el repositorio para la entidad 'incomeCategory'
      const incomeCategoryRepository = dataSource.getRepository(incomeCategory);
       // Realiza una consulta para obtener todos las tipos de categoria de ingresos
      const incomeCategories = await incomeCategoryRepository.find();
      // Envía una respuesta con el estado 200 y los datos de los tipos de identificacion en formato JSON
      res.status(200).json(incomeCategories);
    } catch (error) {
        // Si ocurre un error, lo registra en la consola 
      //console.error('Error al recuperar las categorias de ingresos', error);
      // Envía una respuesta con el estado 500 y un mensaje de error
      res.status(500).json({ error: 'Error al recuperar las categorias de ingresos' });
    }
  };
    // Exporta la función para que pueda ser utilizada en otros módulos
  module.exports = incomeCategories;  