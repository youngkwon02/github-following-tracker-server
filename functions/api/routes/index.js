const express = require('express');
const router = express.Router();

router.use('/tracker', require('./tracker'));

module.exports = router;
