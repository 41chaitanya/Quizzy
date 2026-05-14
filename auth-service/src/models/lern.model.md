surya -- >

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true
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
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;






khalid --> 

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












next is not a function <<--








userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
});






userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.hash(this.password, 12)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch(next);
});





recommended 



userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});



if async function(){} ---> no next()




if function (next){} --->.  use next 



arrow function in middle ware ->never user. this in that if you wwant to use this use. normal function 











router.post("/register",asyncHander(registerController))









