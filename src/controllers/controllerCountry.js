// Importa el objeto de conexión a la base de datos y la entidad de país
const { dataSource } = require('../database');
const country =require('../entities/entityCountry');

// Define una función asíncrona para manejar la solicitud de países
const countries = async (req, res) => {
    try {
        // Obtiene el repositorio para la entidad 'country'
      const countryRepository = dataSource.getRepository(country);
       // Realiza una consulta para obtener todos los países
      const countries = await countryRepository.find();
      // Envía una respuesta con el estado 200 y los datos de los países en formato JSON
      res.status(200).json(countries);
    } catch (error) {
        // Si ocurre un error, lo registra en la consola 
      console.error('Error al recuperar los paises:', error);
      // Envía una respuesta con el estado 500 y un mensaje de error
      res.status(500).json({ error: 'Error al recuperar los paises' });
    }
  };
  // Exporta la función para que pueda ser utilizada en otros módulos
  module.exports = countries;  