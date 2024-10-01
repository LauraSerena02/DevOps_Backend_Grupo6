const express = require('express');
const router = express.Router();
const { findEmail } = require('../controllers/controllerSendEmail');
//Permite crear los endpoints con sus respectivos metodos

router.post('/findEmail', findEmail);

module.exports = router;