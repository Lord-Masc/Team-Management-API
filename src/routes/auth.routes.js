import express from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidator , loginValidator } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerValidator, validate, authController.register);
router.post("/login",loginValidator,validate,authController.login)

export default router;