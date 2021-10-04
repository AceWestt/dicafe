const express = require("express");

const router = express.Router();

const { create } = require("../controllers/userdoodle");

router.route("/").post(create);

module.exports = router;
