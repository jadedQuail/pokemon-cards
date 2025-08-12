import express from "express";
const router = express.Router();

import * as controller from "../controllers/authController.js";
import { registerLimiter } from "../middleware/registerLimiter.js";
import requireAdminOrApiKey from "../middleware/requireAdminOrApiKey.js";

router.post("/validate-turnstile", controller.validateTurnstile);
router.post("/create-user", registerLimiter, controller.createUser);
router.post("/login", controller.login);
router.delete("/delete/:id", requireAdminOrApiKey, controller.deleteUser);

export default router;
