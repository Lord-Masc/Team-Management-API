import express from "express";
import  {register, login, logout, logoutAll } from "../controllers/auth.controller.js";
import { registerValidator , loginValidator } from "../validators/auth.validator.js";
import validate from "../middlewares/validate.js";
import protect from "../middlewares/auth.middlewares.js"

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerValidator, validate, register);
router.post("/login",loginValidator,validate,login)
router.post("/logout",logout)
router.post("/logout-all",protect,logoutAll)

export default router;