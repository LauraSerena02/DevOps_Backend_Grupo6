const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/jwt')
const{getSubtract}  = require('../controllers/controllerSubtraction');


router.get('/getSubtract', checkToken, getSubtract);

module.exports = router;