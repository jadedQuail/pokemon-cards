const express = require("express");
const router = express.Router();
const controller = require("../controllers/typeController");

const requireAdmin = require("../middleware/requireAdmin");

router.get("/", controller.getTypes);

router.post("/", requireAdmin, controller.addType);
router.delete("/:type", requireAdmin, controller.deleteType);

module.exports = router;
