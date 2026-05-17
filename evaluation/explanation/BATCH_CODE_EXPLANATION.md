# Batch Service — Complete Code Explanation
# Har Line Ka Matlab + Kisne Likha
# (Jo Abhi Tak Complete Hua Hai)

---

## Current Status
```
✅ batch.model.js          → AnkushSaha01
✅ enrollment.model.js     → AnkushSaha01
✅ batch.repository.js     → kaif1119
✅ enrollment.repository.js → 41chaitanya (integration)
✅ batch.service.js        → suryakumarsirvi
✅ ApiError.js             → suryakumarsirvi
✅ zod.validator.js        → Madeshiya22
✅ zod.middleware.js       → Madeshiya22
✅ env.config.js           → AnkushSaha01
✅ db.config.js            → AnkushSaha01
✅ app.js                  → AnkushSaha01
✅ server.js               → AnkushSaha01
⏳ batch.controller.js     → Pending (Issue #18)
⏳ batch.route.js          → Pending (Issue #18, #19)
⏳ error.middleware.js     → Pending
⏳ asyncHandler.js         → Pending
```

---

## 📁 src/models/batch.model.js
**Author: AnkushSaha01 (PR #23)**

```js
import mongoose from "mongoose";
```
> Mongoose import karo — MongoDB ke saath kaam karne ke liye ODM.

```js
const batchSchema = new mongoose.Schema({
```
> Batch ka structure define karo.

```js
name: { type: String, required: true, trim: true, unique: true, index: true }
```
> Batch ka naam — required, whitespace trim, unique (duplicate names nahi), indexed for fast search.

```js
description: { type: String, trim: true, default: "" }
```
> Optional description — default empty string.

```js
maxCapacity: { type: Number, default: 0 }
```
> Maximum students allowed. `0` matlab unlimited capacity. (Could have used -1 or null — developer ne comment mein explain kiya)

```js
currentStudentCount: { type: Number, default: 0 }
```
> Abhi kitne students hain — track karne ke liye. Enrollment add/remove hone par update hoga.

```js
status: { type: String, enum: ['active', 'inactive'], default: 'active' }
```
> Batch active hai ya inactive — sirf ye do values allowed hain.

```js
isDeleted: { type: Boolean, default: false, index: true }
```
> Soft delete flag — actual delete nahi karte, sirf true karte hain. Index hai kyunki har query mein filter hoga.

```js
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
```
> Kisne batch banaya — User model ka reference. Required hai.

```js
{ timestamps: true }
```
> Automatically `createdAt` aur `updatedAt` fields.

```js
batchSchema.index({ name: 1, isDeleted: 1 });
```
> Compound index — name aur isDeleted dono saath search karne par fast hoga. Active batches dhundne mein use hoga.

```js
const batchModel = mongoose.model("batches", batchSchema);
```
> 'batches' collection ke liye Model banao.

---

## 📁 src/models/enrollment.model.js
**Author: AnkushSaha01 (PR #23) — Bug fixed by 41chaitanya**

```js
const enrollmentSchema = new mongoose.Schema({
```
> Enrollment ek edge collection hai — Student aur Batch ke beech ka relationship store karta hai.

```js
batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'batches', required: true }
```
> Kaunsi batch mein enrolled hai — Batch model ka reference.

```js
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
```
> Kaunsa student enrolled hai — User model ka reference.

```js
joinedAt: { type: Date, default: Date.now }
```
> Kab join kiya — automatically current time set hogi.

```js
isActive: { type: Boolean, default: true }
```
> Enrollment active hai ya nahi — remove karne par false hoga (soft delete).

```js
enrollmentSchema.index({ batchId: 1, userId: 1 }, { unique: true });
```
> **Most important line** — Ek student ek batch mein sirf ek baar enroll ho sakta hai. Duplicate enrollment database level par prevent hoga.

```js
enrollmentSchema.index({ userId: 1 });
```
> Ek user ke saare enrollments fast dhundne ke liye index.
> **Note:** Original code mein `{unique: true}` tha jo GALAT tha — ek student sirf ek batch mein ho sakta. Fix kiya gaya.

---

## 📁 src/repositories/batch.repository.js
**Author: kaif1119 (PR #25)**

```js
import batchModel from "../models/batch.model.js";
```
> Batch model import karo — database operations ke liye.

```js
export async function create(data) {
    return await batchModel.create(data);
}
```
> Naya batch database mein save karo.

```js
export async function findById(id) {
    return await batchModel.findOne({ _id: id, isDeleted: false });
}
```
> ID se batch dhundo — sirf non-deleted batches. `isDeleted: false` filter har query mein hai.

```js
export async function findByName(name) {
    return await batchModel.findOne({ name, isDeleted: false });
}
```
> Name se batch dhundo — duplicate check ke liye service use karta hai.

```js
export async function findAll() {
    return await batchModel.find({ isDeleted: false });
}
```
> Saare active batches fetch karo — deleted batches nahi aayenge.

```js
export async function updateById(id, data) {
    return await batchModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        data,
        { new: true, runValidators: true }
    );
}
```
> Batch update karo.
> - `{ _id: id, isDeleted: false }` — sirf active batch update hogi
> - `new: true` — updated document return karo (purana nahi)
> - `runValidators: true` — update par bhi schema validations chalenge

```js
export async function softDelete(id) {
    return await batchModel.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true },
        { new: true }
    );
}
```
> Soft delete — actual delete nahi karte, sirf `isDeleted: true` karte hain. Data preserve rehta hai.

---

## 📁 src/repositories/enrollment.repository.js
**Author: 41chaitanya (integration)**

```js
export async function create(data) {
    return await enrollmentModel.create(data);
}
```
> Naya enrollment banao — student ko batch mein add karo.

```js
export async function findByBatchAndUser(batchId, userId) {
    return await enrollmentModel.findOne({ batchId, userId, isActive: true });
}
```
> Check karo ki student already enrolled hai ya nahi — duplicate prevention ke liye.

```js
export async function findAllByBatch(batchId) {
    return await enrollmentModel.find({ batchId, isActive: true }).populate('userId', '-password');
}
```
> Batch ke saare active students fetch karo. `.populate('userId', '-password')` — User ka poora data aayega except password.

```js
export async function removeStudent(batchId, userId) {
    return await enrollmentModel.findOneAndUpdate(
        { batchId, userId },
        { isActive: false },
        { new: true }
    );
}
```
> Student ko batch se remove karo — soft delete, `isActive: false`.

```js
export async function hasActiveStudents(batchId) {
    const count = await enrollmentModel.countDocuments({ batchId, isActive: true });
    return count > 0;
}
```
> Check karo ki batch mein koi student hai ya nahi — delete se pehle check hota hai.

---

## 📁 src/services/batch.service.js
**Author: suryakumarsirvi (PR #26)**

```js
import ApiError from "../utils/ApiError.js";
```
> Custom error class import karo — statusCode ke saath error throw kar sakte hain.

```js
const validateBatchId = (batchId) => {
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new ApiError(400, "Invalid batch ID");
    }
};
```
> Helper function — MongoDB ObjectId valid format mein hai ya nahi check karo. Invalid hai toh 400 error.

```js
const normalizeBatchName = (name = "") => {
    return name.trim().toLowerCase();
};
```
> Batch name normalize karo — "Backend Team" aur "backend team" same maane jayenge. Consistency ke liye.

```js
const findExistingBatch = async (batchId) => {
    validateBatchId(batchId);
    const batch = await batchRepository.findById(batchId);
    if (!batch) { throw new ApiError(404, "Batch not found"); }
    return batch;
};
```
> Reusable helper — ID validate karo, batch dhundo, nahi mila toh 404. Har operation mein use hota hai.

```js
const validateDuplicateBatchName = async (batchName, batchId = null) => {
    const existingBatch = await batchRepository.findByName(batchName);
    if (existingBatch && existingBatch._id.toString() !== batchId) {
        throw new ApiError(409, "Batch with this name already exists");
    }
};
```
> Duplicate name check. `batchId` parameter update ke liye — apna hi naam rakh sakte hain, dusre ka nahi.
> `409 Conflict` — resource already exists.

```js
const createBatch = async (payload, userId) => {
    const normalizedBatchName = normalizeBatchName(payload.name);
    await validateDuplicateBatchName(normalizedBatchName);
    const batchPayload = { ...payload, name: normalizedBatchName, createdBy: userId };
    return await batchRepository.create(batchPayload);
};
```
> Batch create karo:
> 1. Name normalize karo
> 2. Duplicate check karo
> 3. createdBy set karo (logged in user)
> 4. Database mein save karo

```js
const deleteBatch = async (batchId) => {
    await findExistingBatch(batchId);
    const hasStudents = await enrollmentRepository.hasActiveStudents(batchId);
    if (hasStudents) {
        throw new ApiError(400, "Cannot delete batch because students are assigned");
    }
    await batchRepository.softDelete(batchId);
};
```
> Delete se pehle check karo — agar students enrolled hain toh delete nahi hoga. Data integrity protect karta hai.

---

## 📁 src/utils/ApiError.js
**Author: suryakumarsirvi (PR #26)**

```js
class ApiError extends Error {
```
> Built-in Error class extend karo — custom properties add kar sakte hain.

```js
constructor(statusCode = 500, message = "Something went wrong", errors = [], stack = "") {
    super(message);
```
> Parent Error class ko message pass karo.

```js
this.success = false;
this.statusCode = statusCode;
this.message = message;
this.errors = errors;
```
> Custom properties set karo — error handler in properties use karega response banane ke liye.

```js
if (stack) { this.stack = stack; } else { Error.captureStackTrace(this, this.constructor); }
```
> Stack trace capture karo — debugging ke liye kahan error hua pata chalega.

---

## 📁 src/validators/zod.validator.js
**Author: Madeshiya22 (PR #28)**

```js
const BatchBaseSchema = z.object({
    name: z.string({ required_error: 'Batch name is required' }).trim().min(3).max(50),
```
> Batch name: required, trim, 3-50 characters. Custom error message agar missing.

```js
    description: z.string().trim().max(200).optional(),
```
> Description optional hai — `.optional()` matlab undefined bhi valid hai.

```js
    startDate: z.coerce.date({ required_error: 'Start date is required' }),
    endDate: z.coerce.date({ required_error: 'End date is required' }),
```
> `z.coerce.date()` — string ko automatically Date object mein convert karta hai. "2024-01-01" → Date object.

```js
    status: z.enum(['active', 'inactive']).default('active'),
```
> Sirf 'active' ya 'inactive' allowed. Default 'active'.

```js
export const CreateBatchSchema = BatchBaseSchema.refine(
    (data) => data.endDate > data.startDate,
    { message: 'End date must be after start date', path: ['endDate'] }
);
```
> `.refine()` — cross-field validation. endDate startDate se baad hona chahiye. `path: ['endDate']` — error endDate field par show hoga.

```js
export const UpdateBatchSchema = BatchBaseSchema.partial();
```
> `.partial()` — saare fields optional ho jaate hain. Partial update ke liye — sirf jo fields bhejo wahi update hogi.

```js
export const AddStudentSchema = z.object({
    studentId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid student ID' }),
});
```
> MongoDB ObjectId format validate karo — exactly 24 hexadecimal characters.

---

## 📁 src/middlewares/zod.middleware.js
**Author: Madeshiya22 (PR #28)**

```js
export const validate = (schema) => {
    return async (req, res, next) => {
```
> Schema pass karo, middleware return hoga. Route mein: `validate(CreateBatchSchema)`.

```js
req.body = await schema.parseAsync(req.body);
next();
```
> Validate karo aur cleaned data `req.body` mein replace karo. Controller ko clean data milega.

---

## 📁 src/configs/env.config.js + db.config.js
**Author: AnkushSaha01 (PR #23)**

> Auth service ke configs se same pattern — same explanation apply hoti hai.
> Refer karo: `evaluation/AUTH_CODE_EXPLANATION.md`

---

## 📁 src/app.js + src/server.js
**Author: AnkushSaha01 (PR #23)**

> Auth service ke app.js/server.js se same pattern.
> **Note:** Routes aur error handler abhi commented out hain — Issue #18 complete hone par uncomment hoga.

---

## ⏳ Pending Files (Issue #18 & #19)

Ye files abhi nahi hain — contributors implement karenge:

### batch.controller.js (Issue #18)
```
- createBatch handler
- getAllBatches handler
- getBatchById handler
- updateBatch handler
- deleteBatch handler
- addStudent handler (Issue #19)
- removeStudent handler (Issue #19)
- getStudents handler (Issue #19)
```

### batch.route.js (Issue #18 & #19)
```
POST   /api/batches
GET    /api/batches
GET    /api/batches/:id
PUT    /api/batches/:id
DELETE /api/batches/:id
POST   /api/batches/:id/students
DELETE /api/batches/:id/students/:studentId
GET    /api/batches/:id/students
```

### asyncHandler.js
```
Same as auth-service — wrap async functions to catch errors
```

### error.middleware.js
```
Same as auth-service — global error handler using ApiError
```

---

## Summary: Kisne Kya Likha

| File | Author | Issue |
|------|--------|-------|
| batch.model.js | AnkushSaha01 | #15 |
| enrollment.model.js | AnkushSaha01 (bug fix: 41chaitanya) | #15 |
| batch.repository.js | kaif1119 | #16 |
| enrollment.repository.js | 41chaitanya | #16 |
| batch.service.js | suryakumarsirvi | #17 |
| ApiError.js | suryakumarsirvi | #17 |
| zod.validator.js | Madeshiya22 | #20 |
| zod.middleware.js | Madeshiya22 | #20 |
| env.config.js | AnkushSaha01 | #15 |
| db.config.js | AnkushSaha01 | #15 |
| app.js | AnkushSaha01 | #15 |
| server.js | AnkushSaha01 | #15 |
| batch.controller.js | **PENDING** | #18 |
| batch.route.js | **PENDING** | #18, #19 |
| asyncHandler.js | **PENDING** | #18 |
| error.middleware.js | **PENDING** | #18 |
