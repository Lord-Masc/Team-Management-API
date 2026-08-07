import express from "express";
import register from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerValidator, validate, register);

export default router;