const express = require('express');

const { paymeAnother, payme } = require('../controllers/payme');

const router = express.Router();

router.route('/').post(paymeAnother);

module.exports = router;
