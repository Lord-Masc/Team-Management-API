import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import RefreshToken from "../models/refershToken.model.js";

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(409, "User already exists");

    const user = await User.create({
        name,
        email,
        password,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
        success: true,
        message: "User Created successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            accessToken,
        },
    });
});

const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password",
        });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            message: "Password is incorrect",
        });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
        user: user._id,
        token: refreshToken,
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: "Login Successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            accessToken,
        },
    });
});

const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) throw new ApiError(401, "Refresh token is required");

    let decode;
    try {
        // decode holds user id
        decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    const storedToken = await RefreshToken.findOne({ token, user: decode.id });
    if (!storedToken) throw new ApiError(401, "Refresh token has been revoked or does not exist");

    const user = await User.findById(decode.id);
    if (!user) throw new ApiError(401, "User no longer exists");

    const accessToken = generateAccessToken(user);
    res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: { accessToken },
    });
});


const logout = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) await RefreshToken.deleteOne({ token });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});

const logoutAll = asyncHandler(async(req,res)=>{
    await RefreshToken.deleteMany({
        user:req.user.id
    })

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })
    res.status(200).json({
        success:true,
        message:"Logout from all devices successfull"
    })
})

export { register, login, refreshToken, logout, logoutAll };
