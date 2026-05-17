# Auth Service — Complete Code Explanation
# Har Line Ka Matlab + Kisne Likha

---

## 📁 src/server.js
**Author: suryakumarsirvi**

```js
import app from "./app.js";
```
> Express app ko import karo jisme saare middleware aur routes set hain.

```js
import CONFIG from "./configs/env.config.js";
```
> Environment variables (PORT, HOST, etc.) ka frozen object import karo.

```js
import Database from './configs/db.config.js';
```
> MongoDB connection class ka singleton instance import karo.

```js
await Database.connect();
```
> Server start hone se PEHLE MongoDB se connect karo. Agar fail hua toh process.exit(1) hoga.

```js
app.listen(CONFIG.SERVER_PORT, ()=>{
    console.log(`Server Running on Port: ${CONFIG.SERVER_PORT} | ${CONFIG.SERVER_HOST}`);
})
```
> Server ko PORT par start karo. Jab ready ho toh console mein print karo.

---

## 📁 src/app.js
**Author: shubdev (middleware stack) + suryakumarsirvi (routes/structure)**

```js
import express from 'express';
```
> Express framework import karo — HTTP server banane ke liye.

```js
import morgan from 'morgan';
```
> HTTP request logger import karo — dev mode mein har request print hogi.

```js
import helmet from 'helmet';
```
> Security headers middleware — XSS, clickjacking, HSTS jaise attacks se bachata hai.

```js
import compression from 'compression';
```
> Response ko gzip compress karta hai — bandwidth kam hoti hai, speed badhti hai.

```js
import cors from 'cors';
```
> Cross-Origin Resource Sharing — frontend (5173) ko backend (5001) se baat karne deta hai.

```js
import cookieParser from 'cookie-parser';
```
> req.cookies ko parse karta hai — bina iske cookies read nahi ho sakti.

```js
import IndexRoutes from './routes/index.route.js';
```
> Saare routes ka central entry point import karo.

```js
import { globalErrorHandler } from './middlewares/error.middleware.js';
```
> Global error handler — koi bhi unhandled error yahan aake catch hoga.

```js
app.use(helmet());
```
> Har response mein security headers add karo automatically.

```js
app.use(compression());
```
> Har response ko compress karo before sending.

```js
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
```
> Sirf allowed origin se requests accept karo. `credentials: true` matlab cookies bhi allow hain.

```js
app.use(cookieParser());
```
> Incoming request ki cookies parse karo taaki `req.cookies.token` kaam kare.

```js
app.use(express.json());
```
> JSON body parse karo — `req.body` mein data aata hai.

```js
app.use(express.urlencoded({extended: true}));
```
> Form data parse karo (HTML forms ke liye).

```js
app.use(morgan('dev'));
```
> Har request ko console mein log karo — method, URL, status, time.

```js
app.get('/health', async (req, res) => { ... });
```
> Health check endpoint — server aur uptime check karne ke liye. DevOps/monitoring use karta hai.

```js
app.use('/api', IndexRoutes);
```
> Saare API routes `/api` prefix ke saath mount karo.

```js
app.use(globalErrorHandler);
```
> Sabse last mein error handler — koi bhi error yahan aake handle hoga.

---

## 📁 src/configs/env.config.js
**Author: rishipandey02**

```js
import 'dotenv/config';
```
> .env file load karo — process.env mein saari values aa jayengi.

```js
const requiredEnv = ['SERVER_PORT', 'SERVER_HOST', 'MONGO_URI', 'JWT_SECRET', 'NODE_ENV'];
```
> Ye saari env variables ZAROOR honi chahiye — ek bhi missing toh app nahi chalega.

```js
requiredEnv.forEach((key)=>{ if(!process.env[key]){ return console.log(`Required Env Key Missing: ${key}`) } });
```
> Startup par check karo — agar koi variable missing hai toh warn karo. Fail-fast approach.

```js
const CONFIG = Object.freeze({ ... });
```
> Config object banao aur freeze karo — koi bhi accidentally modify nahi kar sakta runtime mein.

```js
export default CONFIG;
```
> Poori app mein ek hi CONFIG object use hoga.

---

## 📁 src/configs/db.config.js
**Author: rishipandey02 + suryakumarsirvi**

```js
class Database {
```
> Database connection ko class mein wrap kiya — OOP pattern, reusable aur testable.

```js
async connect() {
    const conn = await mongoose.connect(CONFIG.MONGO_URI);
```
> MongoDB se connect karo. `conn` mein connection details hain.

```js
console.log(`MongoDB Connected: ${conn.connection.host}`);
```
> Successful connection ka confirmation print karo.

```js
process.exit(1);
```
> Agar DB connect nahi hua toh app band karo — bina DB ke app kaam nahi kar sakta.

```js
registerEvents() {
    mongoose.connection.on('connected', () => { ... });
    mongoose.connection.on('disconnected', () => { ... });
    mongoose.connection.on('error', (error) => { ... });
}
```
> DB connection ke events listen karo — disconnect ya error hone par log karo.

```js
export default new Database();
```
> Singleton pattern — poori app mein ek hi Database instance hoga.

---

## 📁 src/models/user.model.js
**Author: suryakumarsirvi (base) + Kaif1119 (username, refreshToken fields)**

```js
import mongoose from 'mongoose';
```
> Mongoose import karo — MongoDB ODM (Object Document Mapper).

```js
const UserSchema = new mongoose.Schema({
```
> User ka structure define karo — kaunse fields honge, kaunse required hain.

```js
fullname: { type: String, trim: true }
```
> User ka naam — String type, automatically whitespace trim hoga.

```js
username: { type: String, trim: true, sparse: true }
```
> Optional username field. `sparse: true` matlab null values pe unique index apply nahi hoga.

```js
email: { type: String, required: true, unique: true, index: true }
```
> Email required hai, duplicate nahi ho sakta, aur indexed hai — fast search ke liye.

```js
password: { type: String, required: true, select: false }
```
> Password required hai. `select: false` matlab by default queries mein password nahi aayega — security ke liye.

```js
role: { type: String, enum: ['admin', 'user'], default: 'user' }
```
> User ka role — sirf 'admin' ya 'user' allowed hai. Default 'user' hoga.

```js
refreshToken: { type: String, default: null, select: false }
```
> Refresh token store karne ke liye — by default hidden, logout par null ho jayega.

```js
{ timestamps: true }
```
> Automatically `createdAt` aur `updatedAt` fields add hogi.

```js
const UserModel = mongoose.model('users', UserSchema);
```
> 'users' collection ke liye Model banao.

---

## 📁 src/repositories/user.repository.js
**Author: suryakumarsirvi**

```js
export const findById = async (id) => { return await UserModel.findById(id); }
```
> ID se user dhundo — `_id` field se MongoDB mein search.

```js
export const findByEmail = async (email) => { return await UserModel.findOne({email}); }
```
> Email se user dhundo — password nahi aayega (select: false).

```js
export const findByEmailWithPassword = async (email) => {
    return await UserModel.findOne({email}).select("+password");
}
```
> Login ke liye — explicitly password bhi fetch karo taaki compare kar sakein.

```js
export const createOne = async (data) => { return await UserModel.create(data); }
```
> Naya user database mein save karo.

---

## 📁 src/services/user.service.js
**Author: suryakumarsirvi**

```js
export const registerUser = async ({ fullname, email, password }) => {
```
> Register function — destructuring se sirf zaruri fields lo.

```js
if (!fullname || !email || !password) { throw new Error('All fields are required'); }
```
> Basic validation — koi field missing toh error throw karo.

```js
const isExist = await UserRepo.findByEmail(email);
if (isExist) { throw new Error('User already exists, try login'); }
```
> Duplicate email check — same email se do accounts nahi ban sakte.

```js
const hashedPassword = await generateHash(password);
```
> Plain password ko bcrypt se hash karo — database mein kabhi plain password store nahi hoga.

```js
return await UserRepo.createOne(newUser);
```
> Hashed password ke saath user database mein save karo.

```js
export const loginUser = async ({ email, password }) => {
    const user = await UserRepo.findByEmailWithPassword(email);
    if (!user) { throw new Error('Invalid credentials'); }
```
> Email se user dhundo. Agar nahi mila toh "Invalid credentials" — email reveal nahi karte security ke liye.

```js
const isPasswordValid = await compareHash(password, user.password);
if (!isPasswordValid) { throw new Error('Invalid credentials'); }
```
> Entered password ko stored hash se compare karo. Same error message — attacker ko pata nahi chalega ki email sahi tha ya password.

---

## 📁 src/controllers/auth.controller.js
**Author: suryakumarsirvi**

```js
export const handleRegister = asyncHandler(async (req, res) => {
```
> asyncHandler wrap kiya — try-catch likhne ki zarurat nahi, errors automatically next() mein jayenge.

```js
const user = await registerUser({ fullname, email, password });
const token = generateToken({ id: user._id });
```
> User register karo, phir uska JWT token banao.

```js
res.cookie("token", token, {
    httpOnly: true,
    secure: CONFIG.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});
```
> Token ko cookie mein set karo.
> - `httpOnly: true` — JavaScript se access nahi hoga (XSS protection)
> - `secure` — Production mein sirf HTTPS par jayega
> - `sameSite: "strict"` — CSRF attacks se bachata hai
> - `maxAge` — 7 din mein expire hoga (milliseconds mein)

```js
return res.status(201).json({ success: true, message: 'User registered successfully', user: { id, fullname, email } });
```
> 201 Created status ke saath response. Password kabhi response mein nahi bhejte.

```js
export const handleLogout = asyncHandler(async (req, res) => {
    res.clearCookie("token", cookieOptions);
```
> Cookie clear karo — browser se token delete ho jayega, user logged out.

```js
export const handleGetMe = asyncHandler(async (req, res) => {
    const user = await GetUser(req);
```
> `req.user` mein decoded token hai (auth middleware ne set kiya). Us ID se user fetch karo.

---

## 📁 src/middlewares/auth.middleware.js
**Author: suryakumarsirvi**

```js
export const isAuthenticated = async (req, res, next) => {
```
> Protected routes ke liye middleware — pehle ye chalega, phir controller.

```js
const token = req.cookies.token;
```
> Cookie se token nikalo — `cookieParser` middleware ne parse kiya tha.

```js
if (!token) { return res.status(401).json({ success: false, message: "Unauthorized" }); }
```
> Token nahi hai toh 401 Unauthorized return karo — aage mat jane do.

```js
const decoded = verifyToken(token);
req.user = decoded;
next();
```
> Token verify karo — agar valid hai toh decoded data (id, email, role) `req.user` mein daal do. `next()` se controller chalega.

```js
} catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
}
```
> Token invalid ya expired hai toh 401 return karo.

---

## 📁 src/middlewares/zod.middleware.js
**Author: suryakumarsirvi**

```js
export const validate = (schema) => {
    return async (req, res, next) => {
```
> Higher-order function — schema pass karo, middleware return hoga. Reusable pattern.

```js
if (!req.body || !Object.keys(req.body).length) {
    return res.status(400).json({ success: false, message: 'Request body is required' });
}
```
> Empty body check — koi data nahi bheja toh 400 Bad Request.

```js
req.body = await schema.parseAsync(req.body);
```
> Zod se body validate karo. Agar valid hai toh cleaned/transformed data `req.body` mein replace ho jayega.

```js
} catch (error) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: error.issues });
}
```
> Validation fail hone par Zod ke detailed errors return karo — kaunsa field galat hai aur kyun.

---

## 📁 src/middlewares/error.middleware.js
**Author: suryakumarsirvi**

```js
export const globalErrorHandler = (err, req, res, next) => {
```
> Express ka special 4-argument middleware — sirf errors handle karta hai.

```js
console.error(err);
```
> Server logs mein error print karo — debugging ke liye.

```js
return res.status(err.statusCode || 500).json({ success: false, message: 'Internal Server Error', error: err.message });
```
> Custom statusCode hai toh use karo, warna 500. Error message client ko bhejo.

---

## 📁 src/middlewares/role.middleware.js
**Author: Mohd Khalid**

```js
export const authorizeRoles = (...roles) => (req, res, next) => {
```
> Rest parameters — multiple roles pass kar sakte ho: `authorizeRoles('admin', 'moderator')`.

```js
if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
}
```
> User ka role allowed list mein nahi hai toh 403 Forbidden. `req.user` auth middleware ne set kiya tha.

```js
next();
```
> Role match kiya toh aage jane do.

---

## 📁 src/utils/asyncHandler.js
**Author: suryakumarsirvi**

```js
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
```
> Controller function wrap karo. Agar async function mein koi error aaye toh automatically `next(error)` call hoga — global error handler pakad lega. Har controller mein try-catch likhne ki zarurat nahi.

---

## 📁 src/utils/bcrypt.js
**Author: suryakumarsirvi**

```js
import bcrypt from 'bcryptjs'
```
> bcryptjs library — password hashing ke liye. Pure JS implementation, native bindings nahi chahiye.

```js
export const generateHash = (value, salt = 10) => { return bcrypt.hash(value, salt) };
```
> Password hash karo. `salt = 10` matlab 2^10 = 1024 rounds — brute force slow ho jata hai.

```js
export const compareHash = (plainValue, hashValue) => { return bcrypt.compare(plainValue, hashValue); }
```
> Plain password ko stored hash se compare karo — true/false return karta hai.

---

## 📁 src/utils/jwt.js
**Author: suryakumarsirvi**

```js
export const generateToken = (payload, expiry = '7d') => {
    return jwt.sign(payload, CONFIG.JWT_SECRET, { expiresIn: expiry });
};
```
> JWT token banao. `payload` mein user ID hoti hai. Secret key se sign karo. Default 7 din mein expire.

```js
export const verifyToken = (token) => {
    return jwt.verify(token, CONFIG.JWT_SECRET);
};
```
> Token verify karo — agar valid hai toh decoded payload return karo, warna exception throw hoga.

---

## 📁 src/utils/response.js
**Author: Rahul Madeshiya**

```js
export const successResponse = (res, message, data = {}) => {
    return res.status(200).json({ success: true, message, data });
};
```
> Consistent success response format — poori app mein same structure.

```js
export const errorResponse = (res, message = "Something went wrong", status = 500) => {
    return res.status(status).json({ success: false, message });
};
```
> Consistent error response format — default 500, custom message.

---

## 📁 src/validators/zod.validator.js
**Author: suryakumarsirvi (base) + vishu9334 (forgot/reset/change password schemas)**

```js
import * as z from 'zod';
```
> Zod library import karo — TypeScript-first schema validation.

```js
export const RegisterSchema = z.object({
    fullname: z.string().trim().min(3).max(14),
```
> fullname: String hona chahiye, whitespace trim hoga, minimum 3 characters, maximum 14.

```js
    email: z.string().trim().toLowerCase().email(),
```
> Email: trim karo, lowercase mein convert karo, valid email format check karo.

```js
    password: z.string().min(8).max(32).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
```
> Password: 8-32 characters, must have lowercase, uppercase, digit, aur special character.
> - `(?=.*[a-z])` — at least one lowercase
> - `(?=.*[A-Z])` — at least one uppercase
> - `(?=.*\d)` — at least one digit
> - `(?=.*[@$!%*?&])` — at least one special character

```js
export const LoginSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    password: z.string(),
});
```
> Login ke liye sirf email format check karo, password koi bhi string ho sakta hai.

```js
export const forgotPasswordSchema = z.object({
    email: z.string({ required_error: "Email is required" }).trim().email().transform((val) => val.toLowerCase()),
});
```
> Forgot password — email required, valid format, lowercase transform. `required_error` custom message.

```js
export const resetPasswordSchema = z.object({
    otp: z.string().length(6).regex(/^\d{6}$/),
```
> OTP exactly 6 digits hona chahiye, sirf numbers allowed.

```js
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6).max(100),
});
```
> Password change — current password required, new password 6-100 characters.

---

## 📁 src/routes/auth.route.js
**Author: suryakumarsirvi**

```js
AuthRoutes.post('/register', validate(RegisterSchema), handleRegister);
```
> POST /register → pehle Zod validation, phir register controller.

```js
AuthRoutes.post('/login', validate(LoginSchema), handleLogin);
```
> POST /login → pehle validation, phir login controller.

```js
AuthRoutes.post('/logout', isAuthenticated, handleLogout);
```
> POST /logout → pehle auth check (token valid?), phir logout.

```js
AuthRoutes.get('/me', isAuthenticated, handleGetMe);
```
> GET /me → protected route — sirf logged in user apna profile dekh sakta hai.

---

## 📁 src/routes/index.route.js
**Author: suryakumarsirvi**

```js
IndexRoutes.use('/auth', AuthRoutes);
```
> Saare auth routes `/auth` prefix ke saath mount karo. Final URL: `/api/auth/register`, `/api/auth/login`, etc.

---

## Summary: Kisne Kya Likha

| File | Author |
|------|--------|
| server.js | suryakumarsirvi |
| app.js (middleware) | shubdev |
| app.js (routes/structure) | suryakumarsirvi |
| env.config.js | rishipandey02 |
| db.config.js | rishipandey02 + suryakumarsirvi |
| user.model.js (base) | suryakumarsirvi |
| user.model.js (username, refreshToken) | Kaif1119 |
| user.repository.js | suryakumarsirvi |
| user.service.js | suryakumarsirvi |
| auth.controller.js | suryakumarsirvi |
| auth.route.js | suryakumarsirvi |
| index.route.js | suryakumarsirvi |
| auth.middleware.js | suryakumarsirvi |
| zod.middleware.js | suryakumarsirvi |
| error.middleware.js | suryakumarsirvi |
| role.middleware.js | Mohd Khalid |
| asyncHandler.js | suryakumarsirvi |
| bcrypt.js | suryakumarsirvi |
| jwt.js | suryakumarsirvi |
| response.js | Rahul Madeshiya |
| zod.validator.js (base) | suryakumarsirvi |
| zod.validator.js (forgot/reset/change) | vishu9334 |
