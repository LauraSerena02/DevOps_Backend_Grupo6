const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (data)=>{
    const token = jwt.sign(data, process.env.JWT_SECRET, {})
    return token
}

const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; 
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        throw new Error('Token inválido');
    }
}

module.exports = {generateToken, decodeToken}



