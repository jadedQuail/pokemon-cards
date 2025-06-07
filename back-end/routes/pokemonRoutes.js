import express from "express";
const router = express.Router();

import * as controller from "../controllers/pokemonController.js";
import requireAdmin from "../middleware/requireAdmin.js";

router.get("/", controller.getPokemon);

router.post("/edit/:id", requireAdmin, controller.editPokemon);
router.post("/add", requireAdmin, controller.addPokemon);
router.delete("/:id", requireAdmin, controller.deletePokemon);

export default router;
