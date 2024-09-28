const express = require('express');
const router = express.Router();//Permite crear los endpoints con sus respectivos metodos
const identifications = require('../controllers/controllerIdentification')

router.get('/identifications', identifications );

module.exports = router;