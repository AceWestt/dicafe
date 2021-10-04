const express = require("express");

const router = express.Router();

const { contactscreen, update } = require("../controllers/contactscreen");

const { protect } = require("../middleware/auth");

router.route("/").get(contactscreen);
router.route("/:id").put(protect, update);

module.exports = router;
