const express = require('express');
const router = express.Router();//Permite crear los endpoints con sus respectivos metodos
const countries = require('../controllers/controllerCountry')

router.get('/countries', countries );

module.exports = router;