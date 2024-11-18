const express = require('express');
const router = express.Router();
const { checkToken } = require('../middleware/jwt')
const{getSubtract, getFinancialSummary}  = require('../controllers/controllerSubtraction');


router.get('/getSubtract', checkToken, getSubtract);
router.get('/getFinancialSummary', checkToken, getFinancialSummary)

module.exports = router;