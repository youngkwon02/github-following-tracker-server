const express = require('express');
const router = express.Router();

router.post('/user', require('./userGET'));

module.exports = router;
