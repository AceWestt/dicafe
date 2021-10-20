const express = require('express');

const { add } = require('../controllers/order');

const router = express.Router();

router.route('/').post(add);

module.exports = router;
