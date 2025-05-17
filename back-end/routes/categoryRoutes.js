const express = require("express");
const router = express.Router();
const controller = require("../controllers/categoryController");

router.get("/types", controller.getTypes);
router.post("/types", controller.addType);
router.delete("/types/:type", controller.deleteType);

module.exports = router;
