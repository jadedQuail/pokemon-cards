import express from "express";
const router = express.Router();

import * as controller from "../controllers/authController.js";
import { registerLimiter } from "../middleware/registerLimiter.js";

router.post("/create-user", registerLimiter, controller.createUser);
router.post("/login", controller.login);

export default router;
