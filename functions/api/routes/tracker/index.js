const express = require('express');
const router = express.Router();

router.get('/user', require('./userGET'));
router.get('/overall', require('./overallGET'));

module.exports = router;
