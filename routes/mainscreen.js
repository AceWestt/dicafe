const express = require("express");

const router = express.Router();

const { mainscreen, update } = require("../controllers/mainscreen");

const { protect } = require("../middleware/auth");

router.route("/").get(mainscreen);
router.route("/:id").put(protect, update);

module.exports = router;
