import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,  //remove accidental spaces
        minLength: 3,
        maxLength: 50,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false, // don't fetch password from query results by default.
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",

    },
},
    {
        timestamps: true, 
        //gives createdAt and updatedAt fields automatically
    }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;