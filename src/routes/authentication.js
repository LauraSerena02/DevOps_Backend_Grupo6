const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {checkToken} = require('../middleware/jwt')
const { login, createUser, getUserProfile, updateUser } = require('../controllers/controllerAuthentication');
//Permite crear los endpoints con sus respectivos metodos

// Ruta para iniciar sesión
router.post('/login', login);
router.post('/createUser', createUser);
router.get('/getUserProfile/:token', getUserProfile);
router.post('/updateUser/',checkToken, upload.single('photo'), updateUser);

module.exports = router;