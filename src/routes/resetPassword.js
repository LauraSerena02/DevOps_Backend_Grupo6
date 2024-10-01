const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/controllerReset');
//Permite crear los endpoints con sus respectivos metodos

router.post('/resetPassword/:token', resetPassword);

module.exports = router;