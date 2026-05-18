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
        enum: ['admin', 'user', 'teacher'],
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