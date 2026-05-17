# 🧠 Quizzy — Poora Project Explanation (Hinglish Mein)
# Auth Service + Batch Service + Question Service — Abhi Tak Jo Bana

> **Ye document sirf tumhare liye hai** — jo bhi team mein join kare, ye padhe aur samjhe ki project kaise kaam karta hai, kisne kya banaya, aur kya mistakes hue.

---

## 📌 Project Kya Hai?

**Quizzy** ek **microservices-based quiz platform** hai.  
Matlab ek bada application nahi banaya — instead, alag-alag **chote-chote independent services** banaye hain, jo apna kaam khud karte hain.

```
Quizzy Platform
├── auth-service      → Login, Register, JWT Tokens (PORT: 5001)
├── batch-service     → Batch banana, Students assign karna (PORT: 5002 planned)
├── question-service  → Questions banana, store karna (PORT: 5003 planned)
└── client            → React Frontend (PORT: 5173)
```

Har service ka **apna database**, **apna package.json**, **apni files** hain.  
Ek service doosri ki internal code ko directly import nahi karta — sirf APIs ke through communicate karte hain.

---

## 🏗️ Architecture Pattern (Har Service Mein Same)

Har service mein **same layered architecture** follow ki gayi hai:

```
Request aaya
    ↓
Route (URL + Method decide karta hai kahan jaana hai)
    ↓
Middleware (Validate karo — Auth hai? Body sahi hai?)
    ↓
Controller (Request pakdo, response bhejo)
    ↓
Service (Business logic — kya karna hai, kaise karna hai)
    ↓
Repository (Database se baat karo)
    ↓
Model (MongoDB ka schema — data structure)
```

**Kyun ye pattern?** — Har layer ka ek kaam hota hai. Ek layer doosri mein nahi ghusni chahiye. Controller ko pata nahi hona chahiye ki database kaise kaam karta hai.

---

---

# 🔐 TASK 1 — Auth Service

## Overview
JWT-based authentication microservice.  
**Status:** ✅ Production Ready  
**Port:** 5001

## Kya-Kya Bana?

| File | Kaam | Author |
|------|------|--------|
| `server.js` | Server start, DB connect | suryakumarsirvi |
| `app.js` | Middleware stack, routes mount | shubdev + suryakumarsirvi |
| `env.config.js` | .env variables validate + freeze | rishipandey02 |
| `db.config.js` | MongoDB connection (Singleton) | rishipandey02 + suryakumarsirvi |
| `user.model.js` | User ka schema (email, password, role) | suryakumarsirvi + Kaif1119 |
| `user.repository.js` | Database queries (findById, findByEmail) | suryakumarsirvi |
| `user.service.js` | Register + Login ka business logic | suryakumarsirvi |
| `auth.controller.js` | HTTP request handle karna | suryakumarsirvi |
| `auth.middleware.js` | Token check karo — hai ya nahi | suryakumarsirvi |
| `role.middleware.js` | Role check — admin hai ya user | Mohd Khalid |
| `zod.middleware.js` | Body validate karo (Zod se) | suryakumarsirvi |
| `error.middleware.js` | Global error catch | suryakumarsirvi |
| `asyncHandler.js` | Async errors auto-catch | suryakumarsirvi |
| `bcrypt.js` | Password hash + compare | suryakumarsirvi |
| `jwt.js` | Token generate + verify | suryakumarsirvi |
| `response.js` | Standard success/error response | Rahul Madeshiya |
| `zod.validator.js` | Zod schemas (register, login, forgot/reset) | suryakumarsirvi + vishu9334 |

## Flow Samjho — Register kaise kaam karta hai?

```
POST /api/auth/register
    ↓
zod.middleware.js → RegisterSchema se validate karo
    ↓
auth.controller.js → handleRegister
    ↓
user.service.js → registerUser()
    ├── Email already exist? → Error throw karo
    ├── Password hash karo (bcrypt)
    └── Database mein save karo
    ↓
JWT token banao → Cookie mein set karo (httpOnly)
    ↓
201 Response → { success: true, user: { id, name, email } }
```

## Auth Flow — Login ke Baad Protected Route

```
GET /api/auth/me
    ↓
auth.middleware.js → isAuthenticated
    ├── Cookie mein token hai?
    ├── Token valid hai? (JWT verify)
    └── req.user = decoded (id, email, role)
    ↓
Controller → User fetch karo by ID
    ↓
200 Response → User ka data
```

## Bugs Jo Mile (Aur Fix Kiye)

| Bug | Kaun | Kya Hua | Fix |
|-----|------|---------|-----|
| Port 5000 Mac par busy tha | AnkushSaha01 | Apple AirTunes service use karti hai 5000 | Port 5001 kar diya |
| Route `/api/v1/auth` tha | suryakumarsirvi | Frontend expect karta tha `/api/auth` | Standardize kar diya |
| `zod.vaidator.js` — typo in filename | suryakumarsirvi | Import fail hota tha | Rename kiya |
| CSS `@import` order galat | AnkushSaha01 | Vite build fail hota tha | `@import` top par kiya |
| CORS + Cookie Parser missing | Multiple | Cookies read nahi ho rahi thi | `cookieParser()` add kiya |
| `req.user(decoded)` — function call galat | Mohd Khalid | `req.user = decoded` hona chahiye tha | Cherry-pick + fix |

---

---

# 📦 TASK 2 — Batch Service

## Overview
Batch management microservice — Teachers batches bana sakte hain, students ko assign kar sakte hain.  
**Status:** ✅ Fully Completed  
**Port:** 5002 (planned)

## Kya-Kya Bana?

| File | Kaam | Author |
|------|------|--------|
| `batch.model.js` | Batch ka schema (name, capacity, status, soft-delete) | AnkushSaha01 |
| `enrollment.model.js` | Student-Batch relationship (unique pair) | AnkushSaha01 (bug fix: 41chaitanya) |
| `batch.repository.js` | DB queries (create, findById, findAll, softDelete) | kaif1119 |
| `enrollment.repository.js` | Enrollment queries (add, remove, check students) | 41chaitanya |
| `batch.service.js` | Business logic (duplicate check, delete guard) | suryakumarsirvi |
| `ApiError.js` | Custom error class with statusCode | suryakumarsirvi |
| `zod.validator.js` | Batch + Student schemas (date validation bhi) | Madeshiya22 |
| `zod.middleware.js` | Reusable validation middleware | Madeshiya22 |
| `batch.controller.js` | CRUD handlers (create, get, update, delete) | khaliddotio |
| `asyncHandler.js` | Async error wrapper | khaliddotio |
| `batch.routes.js` | API routes + student assignment routes | shobhit2603 |
| `env.config.js`, `db.config.js`, `app.js`, `server.js` | Same as auth-service pattern | AnkushSaha01 |

## Important Features

### 1. Soft Delete
```js
// Batch delete nahi hoti — sirf flag lagta hai
{ isDeleted: true }

// Har query mein ye filter automatically lagta hai
batchModel.find({ isDeleted: false })
```
**Kyun?** — Data permanently delete nahi karte. Audit trail rehti hai. Recover kar sakte ho.

### 2. Enrollment Unique Constraint
```js
// Ek student ek batch mein sirf ek baar enroll ho sakta
enrollmentSchema.index({ batchId: 1, userId: 1 }, { unique: true });
```
**Bug tha Ankush ke code mein:** `userId` pe akele `{ unique: true }` lagaya tha — matlab ek student sirf EK batch mein ho sakta tha globally. Fix kiya — compound index banaya.

### 3. Delete Guard (Business Logic)
```js
// Batch delete karne se pehle check karo
const hasStudents = await enrollmentRepository.hasActiveStudents(batchId);
if (hasStudents) throw new ApiError(400, "Cannot delete batch because students are assigned");
```
**Kyun?** — Agar students enrolled hain aur batch delete ho gayi toh unka data orphan ho jaata. Protection lagaya.

### 4. Zod Cross-Field Validation
```js
// endDate > startDate hona chahiye
export const CreateBatchSchema = BatchBaseSchema.refine(
    (data) => data.endDate > data.startDate,
    { message: 'End date must be after start date' }
);
```

## API Routes (Batch Service)

```
POST   /api/batches              → Naya batch banao
GET    /api/batches              → Saare batches dekho
GET    /api/batches/:id          → Ek batch ka detail
PUT    /api/batches/:id          → Batch update karo
DELETE /api/batches/:id          → Batch delete karo (soft)

POST   /api/batches/:id/students          → Student add karo
DELETE /api/batches/:id/students/:sid     → Student remove karo
GET    /api/batches/:id/students          → Batch ke students dekho
```

## Bugs Jo Mile

| Bug | Kaun | Fix |
|-----|------|-----|
| Enrollment unique index galat tha | AnkushSaha01 | Compound index banaya |
| Controller + Routes pending the | Khalid + Shobhit | Issue #18, #19 complete kiya |

---

---

# ❓ TASK 3 — Question Service

## Overview
Question management microservice — Questions banana, store karna, bulk import karna.  
**Status:** 🚧 In Progress (Foundation Ready)  
**Port:** 5003 (planned)

## Abhi Tak Kya Bana?

| File | Kaam | Author | PR |
|------|------|--------|----|
| `question.model.js` | Question ka Mongoose schema (MCQ/MSQ/TRUE_FALSE/SHORT_ANSWER) | AnkushSaha01 | #58 |
| `question.repository.js` | `create()` + `bulkCreate()` functions | vishu9334 | #57 |
| `package.json` | Dependencies setup | AnkushSaha01 | #58 |
| `.gitignore` | node_modules ignore | AnkushSaha01 | #58 |

## Question Model — Kya-Kya Fields Hain?

```js
{
  type: "MCQ" | "MSQ" | "TRUE_FALSE" | "SHORT_ANSWER",   // Question ka type
  questionText: String (max 2000),                         // Actual question
  options: [String] (max 500 each),                        // Options (MCQ/MSQ ke liye)
  correctAnswer: Mixed,                                    // MCQ: string, MSQ: array
  explanation: String (max 2000),                          // Explanation (optional)
  marks: Number (min 0),                                   // Total marks
  negativeMarks: Number (max 0),                           // Negative marking (-1, -2, etc.)
  subject: String (indexed),                               // Kaunsa subject
  topic: String (indexed),                                 // Kaunsa topic
  difficulty: "EASY" | "MEDIUM" | "HARD",                 // Difficulty level
  tags: [String] (max 20 tags, each max 50 chars),         // Search tags
  createdBy: ObjectId → User,                              // Kisne banaya
  isActive: Boolean,                                       // Active/inactive
  createdAt, updatedAt                                     // Auto timestamps
}
```

## Smart Validators — Ankush Ne Kya Kiya

### 1. Options Validator
```js
// MCQ aur MSQ ke liye minimum 2 options hone chahiye
validator: function(v) {
  if ((this.type === "MCQ" || this.type === "MSQ") && (!v || v.length < 2)) {
    return false;
  }
  return true;
}
```

### 2. Correct Answer Validator (Cross-Field)
```js
// MCQ: answer options mein se hona chahiye
// MSQ: answer ek array hona chahiye, aur sabhi options mein se hone chahiye
if (this.type === "MCQ") {
  return this.options && this.options.includes(v);
}
if (this.type === "MSQ") {
  return Array.isArray(v) && v.every(ans => this.options.includes(ans));
}
```

### 3. Negative Marks Validator
```js
// Negative marks total marks se zyada (magnitude mein) nahi ho sakta
// Agar marks = 2 hai toh negativeMarks >= -2 hona chahiye
validator: function(v) {
  return v >= -this.marks;
}
```

### 4. Compound Indexes (Performance)
```js
questionSchema.index({ createdBy: 1 });
questionSchema.index({ subject: 1, topic: 1, isActive: 1 }); // Subject + topic ke basis pe fast search
```

## Repository Layer — Vishu Ne Kya Kiya

```js
// Ek question banana
export const create = async (data) => {
    return await Question.create(data);
};

// Multiple questions ek saath banana (Bulk Import)
export const bulkCreate = async (dataArray) => {
    return await Question.insertMany(dataArray, {
        ordered: false,      // Ek fail ho toh baaki continue karo
        runValidators: true  // Schema validation bulkCreate mein bhi chalegi
    });
};
```

**`ordered: false` kyun?** — Default `true` hota hai matlab ek document fail hone par saare baad ke documents skip ho jaate. `false` kiya toh valid documents save honge, invalid skip honge.

**`runValidators: true` kyun?** — `insertMany` by default schema validators skip karta hai. Explicitly true karna padta hai taaki data integrity ensure ho.

### ⚠️ Vishu Ki Galti (Jo Fix Ki Gayi)

```
❌ Galat location:  auth-service/src/repositories/ question.repository.js
                    (wrong service + filename mein space)

✅ Sahi location:   question-service/src/repositories/question.repository.js

❌ Galat import:    import { Question } from '../models/question.model.js'  (named)
✅ Sahi import:     import Question from '../models/question.model.js'      (default)
```

**Kyun hua?** — Vishu ne local main branch pull nahi kiya tha jab branch banaya. Question model available nahi tha uske local mein, toh usne `auth-service` mein commit kar diya. **Lesson:** Hamesha pehle `git pull origin main` karo.

Fix maine directly main par push kiya + PR #57 par comment chhoda.

## Abhi Kya Kaam Pending Hai (Question Service)

```
⏳ question.service.js       → Business logic (create, validate, search)
⏳ question.controller.js    → HTTP handlers
⏳ question.routes.js        → API endpoints
⏳ zod.validator.js          → Zod schemas for request body
⏳ env.config.js             → Environment config
⏳ db.config.js              → MongoDB connection
⏳ app.js + server.js        → Service bootstrap
```

---

---

# 🔄 Git Workflow — Hum Kaise Kaam Karte Hain

## Branch Naming Convention
```
feature/<name>/<kaam>
ankush/feature/question-schema
vishu/bulk/question/repository/functions
```

## PR Merge Process
1. Student apna branch push karta hai
2. GitHub par PR open karta hai → `main` mein merge karo
3. **Main branch protected hai** — directly push nahi ho sakta students ke liye
4. Admin (41chaitanya) review karta hai + approve karta hai
5. `--squash` merge — saare commits ek mein combine ho jaate hain
6. `--admin` flag — branch protection bypass karna padta hai admin ke liye

## Squash Merge Kyun?
```
❌ Bina squash ke:
   abc123 - WIP commit
   def456 - fix typo
   ghi789 - actual feature

✅ Squash ke baad:
   xyz000 - feat(question-service): add question schema [Ankush]
```
Clean history rehti hai main branch mein.

---

---

# 📊 Contributors Summary — Abhi Tak

## Task 1 (Auth Service)

| Contributor | Contribution | Score |
|-------------|-------------|-------|
| **suryakumarsirvi** | Core auth, repository pattern, JWT, middleware | ⭐⭐⭐⭐⭐ |
| **AnkushSaha01** | Complete React frontend (Redux, Router, HookForm) | ⭐⭐⭐⭐⭐ |
| **shubdev** | Production middleware (helmet, compression, CORS) | ⭐⭐⭐⭐ |
| **Kaif1119** | Refresh token system, enhanced user model | ⭐⭐⭐⭐ |
| **Mohd Khalid** | Role-based middleware (bug tha — fix kiya) | ⭐⭐⭐ |
| **Rahul Madeshiya** | Response utilities | ⭐⭐⭐ |
| **rishipandey02** | Config validation, DB config | ⭐⭐⭐ |
| **vishu9334** | Zod validators (forgot/reset/change password) | ⭐⭐⭐ |

## Task 2 (Batch Service)

| Contributor | Contribution | Score |
|-------------|-------------|-------|
| **suryakumarsirvi** | Business logic, ApiError, service layer | ⭐⭐⭐⭐⭐ |
| **shobhit2603** | Student APIs, routes, integration | ⭐⭐⭐⭐⭐ |
| **AnkushSaha01** | Models, configs, server setup | ⭐⭐⭐⭐ |
| **kaif1119** | Batch repository layer | ⭐⭐⭐⭐ |
| **Madeshiya22** | Zod validators, validation middleware | ⭐⭐⭐⭐ |
| **khaliddotio** | CRUD controllers, asyncHandler | ⭐⭐⭐⭐⭐ |
| **41chaitanya** | Enrollment repository, bug fixes, integration | ✅ Admin |

## Task 3 (Question Service) — Abhi Chal Raha Hai

| Contributor | Contribution | Score |
|-------------|-------------|-------|
| **AnkushSaha01** | Question model (full schema + validators) | ⭐⭐⭐⭐⭐ |
| **vishu9334** | Repository layer (create + bulkCreate) | ⭐⭐⭐ (galat folder mein diya) |
| **41chaitanya** | Fix + correct path par move kiya | ✅ Admin |

---

---

# 🎓 Lessons Learned (Poori Team Ke Liye)

## Git Rules — Hamesha Follow Karo

```bash
# ✅ Branch banane se PEHLE hamesha ye karo
git checkout main
git pull origin main
git checkout -b your-name/feature/kya-bana-rahe-ho
```

## File Placement Rules
- Har service mein kaam sirf usi service ke folder mein karo
- `auth-service/` ka kaam `question-service/` mein mat karo
- Filename mein space mat lagao — `' question.js'` → `'question.js'`

## Import Rules
```js
// ✅ Default export ka import
import Question from '../models/question.model.js';

// ✅ Named export ka import
import { create, findById } from '../repositories/question.repository.js';

// ❌ Galat — default ko named ki tarah import karna
import { Question } from '../models/question.model.js'; // undefined aayega
```

## .env File Git Mein Mat Daalo
```
# .gitignore mein hona ZAROOR chahiye
.env
node_modules/
```

## PR Description Likho
- Kya add kiya, kyun add kiya, kaunsa pattern follow kiya — briefly likho
- Agar koi limitation hai toh bolo (jaise Vishu ne comment mein bataya)

---

# 📁 Poori File Structure (Abhi Tak)

```
quiz_app_kodr/
│
├── auth-service/                     ✅ COMPLETE
│   └── src/
│       ├── configs/                  (env + db config)
│       ├── controllers/              (auth.controller.js)
│       ├── middlewares/              (auth, role, zod, error)
│       ├── models/                   (user.model.js)
│       ├── repositories/             (user.repository.js)
│       ├── routes/                   (auth.route.js, index.route.js)
│       ├── services/                 (user.service.js)
│       ├── utils/                    (jwt, bcrypt, response, asyncHandler)
│       └── validators/               (zod.validator.js)
│
├── batch-service/                    ✅ COMPLETE
│   └── src/
│       ├── configs/                  (env + db config)
│       ├── controllers/              (batch.controller.js)
│       ├── middlewares/              (zod.middleware.js, asyncHandler.js)
│       ├── models/                   (batch.model.js, enrollment.model.js)
│       ├── repositories/             (batch.repository.js, enrollment.repository.js)
│       ├── routes/                   (batch.routes.js)
│       ├── services/                 (batch.service.js)
│       └── utils/                    (ApiError.js)
│
├── question-service/                 🚧 IN PROGRESS
│   └── src/
│       ├── models/                   ✅ question.model.js (AnkushSaha01)
│       └── repositories/             ✅ question.repository.js (vishu9334, fixed by 41chaitanya)
│       ⏳ configs/                   → Pending
│       ⏳ controllers/               → Pending
│       ⏳ middlewares/               → Pending
│       ⏳ routes/                    → Pending
│       ⏳ services/                  → Pending
│       ⏳ validators/                → Pending
│
└── client/                           ✅ COMPLETE (React + Redux)
    └── src/
        ├── app/                      (store, router, layout)
        └── features/auth/            (login, register, hooks, API)
```

---

**Generated:** May 17, 2026  
**Project:** Quizzy — Microservices Quiz Platform  
**Organization:** 41chaitanya / Quizzy  
**Document Language:** Hinglish (Hindi + English mix)
