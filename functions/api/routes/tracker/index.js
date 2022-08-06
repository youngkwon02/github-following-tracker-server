const express = require('express');
const router = express.Router();

router.get('/user', require('./userGET'));

module.exports = router;
