const express = require("express");
const router = express.Router();
const controller = require("../controllers/setController");

const requireAdmin = require("../middleware/requireAdmin");

router.get("/", controller.getSets);

router.post("/", requireAdmin, controller.addSet);
router.delete("/:set", requireAdmin, controller.deleteSet);

module.exports = router;
