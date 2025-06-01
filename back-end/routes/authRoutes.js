import express from "express";
import { createUser, login } from "../controllers/authController.js";
import { registerLimiter } from "../middleware/registerLimiter.js";

const router = express.Router();

router.post("/create-user", registerLimiter, createUser);
router.post("/login", login);

export default router;
