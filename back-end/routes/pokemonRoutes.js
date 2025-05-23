const express = require("express");

const router = express.Router();
const controller = require("../controllers/pokemonController");

router.get("/", controller.getPokemon);
router.get("/column-headers", controller.getColumnHeaders);
router.post("/edit/:id", controller.editPokemon);
router.post("/add", controller.addPokemon);
router.delete("/:id", controller.deletePokemon);

module.exports = router;
