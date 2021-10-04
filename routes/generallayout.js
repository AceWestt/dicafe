const express = require("express");

const router = express.Router();

const { general, update } = require("../controllers/generallayout");

const { protect } = require("../middleware/auth");

router.route("/").get(general);
router.route("/:id").put(protect, update);

module.exports = router;
