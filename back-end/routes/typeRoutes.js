import express from "express";
import * as controller from "../controllers/typeController.js";
import requireAdminOrApiKey from "../middleware/requireAdminOrApiKey.js";

const router = express.Router();

router.get("/", controller.getTypes);

router.post("/", requireAdminOrApiKey, controller.addType);
router.delete("/:type", requireAdminOrApiKey, controller.deleteType);

export default router;
