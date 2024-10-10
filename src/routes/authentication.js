const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { login, createUser, getUserProfile, updateUser } = require('../controllers/controllerAuthentication');
//Permite crear los endpoints con sus respectivos metodos

// Ruta para iniciar sesión
router.post('/login', login);
router.post('/createUser', createUser);
router.get('/getUserProfile/:userId', getUserProfile);
router.post('/updateUser/:userId', upload.single('photo'), updateUser);

module.exports = router;