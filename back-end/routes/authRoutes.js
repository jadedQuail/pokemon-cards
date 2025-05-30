const express = require("express");

const router = express.Router();
const controller = require("../controllers/authController");

const { registerLimiter } = require("../middleware/registerLimiter");

router.post("/create-user", registerLimiter, controller.createUser);
router.post("/login", controller.login);

module.exports = router;
