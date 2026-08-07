const asyncHandler = require("../middlewares/asyncHandler")
const User = require("../models/user.model")
const ApiError = require("../utils/ApiError")

import {generateAccessToken , generateRefreshToke} from "../utils/generateToken"
import {RefreshToken} from "../models/refershToken.model"

const register = asyncHandler(async(req,res)=>{
    const {name,password,email} = req.body

    const userExists = await User.findOne({email})
    if(userExists) throw new ApiError(409,"User already exists")

    const user = await User.create({
        name,
        email,
        password
    })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToke(user)

    await RefreshToken.create({
        user:user._id,
        token:refreshToken,
        expiredAt:new Date( Date.now() + 7 * 24 * 60 * 60 * 1000 ),
    })

    // Sends RefershToke as HTTPOnly cookie

    res.cookies("refreshToken",refreshToken,{
         httpOnly:true,
         secure:process.env.NODE_ENV === "production",
         sameSite:"strict",
         maxAge:7 * 24 * 60 * 60 * 1000,
    })

    res.status(401).json({
        sucesss:true,
        message:"User Created successfully",
        data:{
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                isVerified: user.isVerified,
            },
            accessToken
        }
    })
})

module.exports = register