import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"

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

const authorize = (...role)=>{
    return (req,res,next)=>{
      if(!req.user){
        return next(
           new ApiError(401,"Authentiation required")
        )
      }

      if(!role.includes(req.user.role)){
        return next(
          new ApiError(40,"You are not allow to access this code")
        )
      }
      next()

    }
}

module.exports = {protect,authorize} ;