const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

dotenv.config();


const checkToken =(req,res,next)=>{
    
    const token = req.headers['authorization']
    if(!token){
        return res.status(401).json("No se ha encontrado el token asociado")
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json("El token no es valido")
    }
};

module.exports ={checkToken}