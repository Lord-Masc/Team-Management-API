import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"
import asyncHandler from "./asyncHandler.js";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access token is required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

const authorize = (...role) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!role.includes(req.user.role)) {
      return next(new ApiError(403, "You are not allowed to access this resource"));
    }
    next();
  };
};

const getMe = asyncHandler(async(req,res)=>{
  res.status(200).json({
    sucess:true,
    message:"Currect user fetch successfully",
    data:{
      user:{
          id:req.user._id,
          name:req.user.name,
          email:req.user.email,
          role:req.user.role,
          isVerified:req.user.isVerified
      }
    }
  })
})

export { authorize,getMe };
export default protect;
// module.exports = {protect,authorize} ;