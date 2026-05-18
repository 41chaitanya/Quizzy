import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: true,
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
        enum: ['admin', 'teacher', 'student'],
        default: 'student'
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
