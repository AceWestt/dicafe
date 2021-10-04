const express = require("express");

const router = express.Router();

const { doodlescreen, update } = require("../controllers/doodlescreen");

const { protect } = require("../middleware/auth");

router.route("/").get(doodlescreen);
router.route("/:id").put(protect, update);

module.exports = router;
