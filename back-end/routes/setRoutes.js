import express from "express";
import * as controller from "../controllers/setController.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", controller.getSets);

router.post("/", requireAdmin, controller.addSet);
router.delete("/:set", requireAdmin, controller.deleteSet);

export default router;
