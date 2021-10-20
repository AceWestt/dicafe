const express = require('express');

const { paymeAnother } = require('../controllers/payme');

const router = express.Router();

router.route('/').post(paymeAnother);

module.exports = router;
