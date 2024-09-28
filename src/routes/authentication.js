const express = require('express');
const router = express.Router();
const { login, createUser } = require('../controllers/controllerAuthentication');
//Permite crear los endpoints con sus respectivos metodos

// Ruta para iniciar sesión
router.post('/login', login);
router.post('/createUser', createUser);

module.exports = router;