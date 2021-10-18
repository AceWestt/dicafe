const express = require('express');

const { payme } = require('../controllers/payme');

const router = express.Router();

router.route('/').post(payme);

module.exports = router;
