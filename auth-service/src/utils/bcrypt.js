import bcrypt from 'bcryptjs'

export const generateHash = (value, salt = 10) => {
    return bcrypt.hash(value, salt)
};

export const compareHash = (plainValue, hashValue) =>{
    return bcrypt.compare(plainValue, hashValue);
}