import { validationResult } from "express-validator";

const validate = (req,res,next)=>{
    const error = validationResult(req)

    if(error.isEmpty()) return next()

    return res.status(400).json({
        sucess:false,
        message:"validation faild",
        errors:errors.array()
    })
}

module.exports = validate