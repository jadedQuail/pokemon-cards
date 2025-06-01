import express from "express";
import * as controller from "../controllers/typeController.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", controller.getTypes);

router.post("/", requireAdmin, controller.addType);
router.delete("/:type", requireAdmin, controller.deleteType);

export default router;
