const express = require('express');
const router = express.Router();//Permite crear los endpoints con sus respectivos metodos
const { showRandomTip } = require('../controllers/controllerTip');

router.get('/showRandomTip', showRandomTip);

module.exports = router;