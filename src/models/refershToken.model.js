import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    token:{
        type:String,
        reuire:true,
    },
    expiredAt:{
        type:Date,
        require:true
    }
},{timestamps:true})

refreshTokenSchemah.index(
    {expiredAt:1},
    {expiredAferSecond:0}
)

module.exports = mongoose.Schema("RefreshToken",refreshTokenSchema)