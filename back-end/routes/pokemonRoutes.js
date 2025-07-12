import express from "express";
const router = express.Router();

import * as controller from "../controllers/pokemonController.js";
import requireAdminOrApiKey from "../middleware/requireAdminOrApiKey.js";

router.get("/", controller.getPokemon);

router.post("/edit/:id", requireAdminOrApiKey, controller.editPokemon);
router.post("/add", requireAdminOrApiKey, controller.addPokemon);
router.delete("/:id", requireAdminOrApiKey, controller.deletePokemon);

export default router;
