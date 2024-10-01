const { dataSource } = require('../database');
const bcrypt = require('bcryptjs');

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



const resetPassword = async (req, res) => {
    

    const { token } = req.params;
    const { newPassword, email } = req.body;

    //Busqueda del registro del Token por el email
    const tokenRepository = dataSource.getRepository("token")
    const tokenEntity = await tokenRepository.findOne({ where: { email: email}, order:{tokenExpirationDate:'DESC' } });

    if (!tokenEntity) {
         return res.status(400).json({ message: 'No se encuentra el token del email'});
    }

    if(new Date() > tokenEntity.tokenExpirationDate){
        return res.status(400).json({ message: 'La solicitud expiró'});
    }
    //Compara el token enviado por parámetros con el guardado en la base de datos
    if(!bcrypt.compareSync(token,tokenEntity.tokenInfo)) {
        return res.status(400).json({ message: 'No coinciden los tokens'});
    }
        
       
       

        const repositorio = dataSource.getRepository("user");
        const userEntity = await repositorio.findOne({ where: { email: email}});

        if (!userEntity) {
            return res.status(400).json({ message: 'No se encuentra el usuario'});
        }

        const hashedPassword = await hashPassword(newPassword);

        userEntity.password = hashedPassword; //Columna de la tabla 
        await repositorio.save(userEntity)
        res.json({ msg: "Contraseña actualizada"});
   
   
};

module.exports = {resetPassword};  