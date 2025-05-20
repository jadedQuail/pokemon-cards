const express = require("express");
const router = express.Router();
const controller = require("../controllers/typeController");

router.get("/", controller.getTypes);
router.post("/", controller.addType);
router.delete("/:type", controller.deleteType);

module.exports = router;
