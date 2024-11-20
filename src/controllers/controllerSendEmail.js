const { dataSource } = require('../database');
const user = require ('../entities/entityUser');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service: 'gmail', // El servicio que uses (SendGrid, Outlook, Gmail)
    auth: {
    user: 'pelcdevops@gmail.com', // Tu email
    pass: 'odmn fane ldjr lzyc' // Contraseña del email, en gmail app password
    }
});

const findEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const userRepository = dataSource.getRepository(user)
        const userEntity = await userRepository.findOne({ where: { email: email } }); 
        //Email guardado de la base de datos, email de la peticion

        if (!userEntity) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        //Generar el token de recuperacion
        const tokenGenerate = crypto.randomBytes(32).toString('hex'); //Genera el token de 32 bytes, 256 bits
        const tokenHash = bcrypt.hashSync(tokenGenerate, 10); // Encripta el token
        const tokenEntity ={};
        tokenEntity.email = userEntity.email;
        tokenEntity.tokenInfo = tokenHash;
        tokenEntity.tokenExpirationDate = new Date(Date.now() + 3600000); // 1 hora de validez

        
        const repositorio = dataSource.getRepository("token")
        await repositorio.save(tokenEntity)

        // Enviar correo
        const formUrl = 'http://devops-grupo6-fronted.onrender.com/changePassword/' + tokenGenerate + "/" + email; //Enlace de la vista front-end
        const emailOptions = {
        from: 'pelcdevops@gmail.com',
        to: userEntity.email,
        subject: 'Recuperación de contraseña',
        html: `
        <p>Haga clic en el siguiente enlace para recuperar su contraseña:</p>
        <a href="${formUrl}">${formUrl}</a>
        `
        
        };
         
        transporter.sendMail(emailOptions);
        return res.status(200).json({ message: 'Correo de recuperación enviado' });
        
    } catch (error) {
        console.error('Error al encontrar el email', error);
        return res.status(400).json({ error: ''});
    }
    
  };

  module.exports = {findEmail};  
