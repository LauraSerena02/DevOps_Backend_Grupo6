const { dataSource } = require('../database');
const tip= require('../entities/entityTip');
const cloudinary = require("../utils/cloudinary");

// Traer noticia de manera aleatoria
const showRandomTip = async (req, res) => {
    try {
        const repositorio = dataSource.getRepository(tip);
        
        // Obtener el total de noticias
        const totalCount = await repositorio.count();
        if (totalCount === 0) {
            return res.status(404).json({ error: 'No hay consejos disponibles' });
        }

        // Generar un índice aleatorio
        const randomIndex = Math.floor(Math.random() * totalCount);

        // Obtener la noticia en el índice aleatorio
        const tip2 = await repositorio.find({
            skip: randomIndex,
            take: 1,
        });

        if (tip2.length === 0) {
            return res.status(404).json({ error: 'Consejo no encontrado' });
        }

        res.json(tip2[0]);
    } catch (error) {
        console.error('Error al obtener la noticia:', error);
        res.status(500).json({ error: 'Error al obtener el consejo', details: error.message });
    }
};

module.exports = {showRandomTip};  
