const express = require("express");

const router = express.Router();

const { orderscreen, update } = require("../controllers/orderscreen");

const { protect } = require("../middleware/auth");

router.route("/").get(orderscreen);
router.route("/:id").put(protect, update);

module.exports = router;
