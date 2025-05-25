const express = require("express");
const router = express.Router();
const controller = require("../controllers/pokemonController");

const requireAdmin = require("../middleware/requireAdmin");

router.get("/", controller.getPokemon);
router.get("/column-headers", controller.getColumnHeaders);

router.post("/edit/:id", requireAdmin, controller.editPokemon);
router.post("/add", requireAdmin, controller.addPokemon);
router.delete("/:id", requireAdmin, controller.deletePokemon);

module.exports = router;
