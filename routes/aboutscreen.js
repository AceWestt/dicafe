const express = require("express");

const router = express.Router();

const { aboutscreen, update } = require("../controllers/aboutscreen");

const { protect } = require("../middleware/auth");

router.route("/").get(aboutscreen);
router.route("/:id").put(protect, update);

module.exports = router;
