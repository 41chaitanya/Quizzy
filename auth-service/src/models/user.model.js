<<<<<<< HEAD
import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
         type: String,
         required: true,
         unique: true
        },
        password:{
            type: String,
            required: true
        },
        role:{
            type:String,
            enum:["user","admin","quiz_creater"],
            default:"user"
        }
    },{
        timeStamps: true
    }
)


export default mongoose.model("User", userSchema)
=======
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true,
        sparse: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    refreshToken: {
        type: String,
        default: null,
        select: false
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
>>>>>>> dfb84492e962b8ae0649259916816f10d60ad178
