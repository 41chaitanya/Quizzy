import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false,
        
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
},{timestamps:true})


const userModel = mongoose.model("user",userSchema)

export default userModel