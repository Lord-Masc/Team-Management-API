const moogoose = require("mongoose")
import bcyrypt from "bcrypt"
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Name is require"],
        trim:true,
        minlenght:3,
        maxlength:20
    },
    email:{
        type:String,
        require:[true,"Email is compulsary"],
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        require:[true,"Password must be require"],
        minlength:8,
        select:false
    },
    role:{
        type:String,
        enum:[
            "admin","manager","developer","viewer"
        ],
        default:"developer"
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) next();
    this.password = await bcyrypt.hash(this.password,10)
    next()
})

userSchema.methods.comparePassword = async function(password){
    return await bcyrypt.compare(this.password,password);
}

module.exports = mongoose.model("User",userSchema)