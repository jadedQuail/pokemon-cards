import express from "express";
import * as controller from "../controllers/setController.js";
import requireAdminOrApiKey from "../middleware/requireAdminOrApiKey.js";

const router = express.Router();

router.get("/", controller.getSets);

router.post("/", requireAdminOrApiKey, controller.addSet);
router.delete("/:set", requireAdminOrApiKey, controller.deleteSet);

export default router;
