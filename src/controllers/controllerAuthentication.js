const { connection, dataSource } = require('../database');
const bcrypt = require('bcrypt'); // Biblioteca para cifrar contraseñas.
const dotenv = require('dotenv');
const user = require('../entities/entityUser');
const country = require('../entities/entityCountry');
const identification = require('../entities/entityIdentificationType');
const cloudinary = require("../utils/cloudinary");


dotenv.config();

 
async function hashPassword(password) {
  const saltRounds = 10; //
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error(err);
    throw new Error('Error al encriptar la contraseña');
  }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const repository = dataSource.getRepository("user");
        
        if (!email || !password ) {
            return res.status(400).json({ error: 'Se requiere el email del usuario y la contraseña.' });
        }
        // Buscar el email
        const user = await repository.findOne({ where: { email: email} });
        if (!user) {
            return res.status(401).json({ error: 'Usuario incorrecto' });
        }
        

        // Verificar la contraseña proporcionada con la contraseña encriptada almacenada en la base de datos
       const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Si el email y la contraseña es correcta, enviar mensaje de éxito 
        res.json({ message: 'Login exitoso'});
    } catch (error) {
        console.error('Error al realizar el login:', error);
        res.status(500).json({ error: 'Error al realizar el login' });
    }
};

const createUser = async (req, res) => {
    try {
        const data = req.body
        const {userName, userLastName, typeId, idNumber, email, countryId, password, phone} = data;
        

        // Verificar que todos los campos necesarios están presentes
        if (!userName|| !userLastName || !typeId || !idNumber || !email|| !countryId || !password || !phone) {
            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        const user= {userName, userLastName, typeId, idNumber, email, countryId, password, phone};

        const hashedPassword = await hashPassword(password);
        user.password = hashedPassword; //Columna de la tabla

        const identificationRepository = dataSource.getRepository(identification)
        const identificationEntity = await identificationRepository.findOne({ where: { typeId: typeId } });

        if (!identificationEntity) {
            return res.status(400).json({ message: 'Tipo de identificacion no encontrada' });
        }

        const countryRepository = dataSource.getRepository(country)
        const countryEntity = await countryRepository.findOne({ where: { countryId: countryId } });

        if (!countryEntity) {
            return res.status(400).json({ message: 'Pais no encontrado' });
        }
        const repositorio = dataSource.getRepository("user");
        
        await repositorio.save(user)
        res.json({ msg: "usuario agregado"});

    } catch (error) {
        console.error('Error al agregar el usuario:', error);
        res.status(400).json({ error: ''});
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // ID pasado como parámetro
        const userRepository = dataSource.getRepository("user");
        
        const user = await userRepository.findOneBy({ userId });

        if (!user) {
            console.error(`Usuario no encontrado: ID ${userId}`);
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const identificationTypeRepo = dataSource.getRepository(identification);
        const identificationEntity = await identificationTypeRepo.findOneBy({ typeId: user.typeId });

        // Consultar countryName de tblCountry usando la entidad
        const countryRepo = dataSource.getRepository(country);
        const countryEntity = await countryRepo.findOneBy({ countryId: user.countryId });

        const response = {
            
            photoUser: user.photoUser,
            userName: user.userName,
            idNumber: user.idNumber,
            userLastName: user.userLastName, // Corregido el nombre de campo
            phone: user.phone,
            email: user.email,
            countryName: countryEntity ? countryEntity.countryName : null,// Nombre del país
            idDescription: identificationEntity ? identificationEntity.idDescription : null, // Accediendo a idDescription
    
        };
        console.log(response)
        // Aquí el usuario incluye todos los atributos definidos en la entidad
        res.json(response);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error al cargar perfil', error });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId; // ID del usuario de los parámetros de la URL
        const data = req.body;
        const { userName, userLastName, typeId, idNumber, email, countryId, password, phone } = data;
        
        // Verificar que todos los campos obligatorios están presentes, excepto la contraseña
        if (!userName || !userLastName || !typeId || !idNumber || !email || !countryId || !phone) {
            

            return res.status(400).json({ error: 'El contenido no está completo' });
        }

        const userRepository = dataSource.getRepository("user");
        const user = await userRepository.findOneBy({ userId });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Validar tipo de identificación
        const identificationRepository = dataSource.getRepository(identification);
        const identificationEntity = await identificationRepository.findOneBy({ typeId });

        if (!identificationEntity) {
            return res.status(400).json({ message: 'Tipo de identificación no encontrado' });
        }

        // Validar país
        const countryRepository = dataSource.getRepository(country);
        const countryEntity = await countryRepository.findOneBy({ countryId });

        if (!countryEntity) {
            return res.status(400).json({ message: 'País no encontrado' });
        }
         
        // Actualizar campos
        user.userName = userName;
        user.userLastName = userLastName;
        user.typeId = typeId;
        user.idNumber = idNumber;
        user.email = email;
        user.countryId = countryId;
        user.phone = phone;
        

        // Actualizar la contraseña solo si se proporciona
        if (password) {
            user.password = await hashPassword(password); // Actualiza la contraseña
        }

        if(user.photoUser){
            const public_id = user.photoUser.split('/').pop().split('.')[0];
                await new Promise((resolve, reject) => {
                    cloudinary.uploader.destroy(public_id, (err, result) => {
                        if (err) {
                            console.log('Error al eliminar la imagen antigua:', err);
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }); 
        } 

        if (req.file) {
            

            // Subir la nueva imagen a Cloudinary desde el buffer de multer
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }).end(req.file.buffer);
            });

            user.photoUser = result.secure_url;
        }
        else {
            user.photoUser = null; // Si no actualiza es null
        }
        await userRepository.save(user);
        res.json({ msg: "Usuario actualizado" });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    login,
    createUser,
    getUserProfile,
    updateUser
};