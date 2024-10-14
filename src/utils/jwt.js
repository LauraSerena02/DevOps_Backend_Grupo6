const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (data)=>{
    const token = jwt.sign(data, process.env.JWT_SECRET, {})
    return token
}

module.exports = {generateToken}



