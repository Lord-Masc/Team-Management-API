import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
}
