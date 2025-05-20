const express = require("express");
const router = express.Router();
const controller = require("../controllers/setController");

router.get("/", controller.getSets);
router.post("/", controller.addSet);
router.delete("/:set", controller.deleteSet);

module.exports = router;
