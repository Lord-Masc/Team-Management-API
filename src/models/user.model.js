import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
        email: {
            type: String,
            required: [true, "Email is compulsory"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password must be required"],
            minlength: 8,
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "manager", "developer", "viewer"],
            default: "developer",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);