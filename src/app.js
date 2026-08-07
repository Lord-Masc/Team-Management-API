
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middlewares/error.middlewares.js";

const app = express();

// ==============================
// Global Middleware
// ==============================

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// ==============================
// Routes
// ==============================

app.use("/api/auth", authRoutes);

// ==============================
// Global Error Handler
// MUST BE LAST
// ==============================

app.use(errorHandler);

export default app;

