// Importa el objeto de conexión a la base de datos y la entidad tipo de identificacion
const { dataSource } = require('../database');
const identification =require('../entities/entityIdentificationType');

// Define una función asíncrona para manejar la solicitud de tipos de identificacion
const identifications = async (req, res) => {
    try {
        // Obtiene el repositorio para la entidad 'country'
      const identificationRepository = dataSource.getRepository(identification);
       // Realiza una consulta para obtener todos las tipos de identificacion
      const identifications = await identificationRepository.find();
      // Envía una respuesta con el estado 200 y los datos de los tipos de identificacion en formato JSON
      res.status(200).json(identifications);
    } catch (error) {
        // Si ocurre un error, lo registra en la consola 
      console.error('Error al recuperar los tipos de identificacion:', error);
      // Envía una respuesta con el estado 500 y un mensaje de error
      res.status(500).json({ error: 'Error al recuperar los tipos de identificacion' });
    }
  };
    // Exporta la función para que pueda ser utilizada en otros módulos
  module.exports = identifications;  