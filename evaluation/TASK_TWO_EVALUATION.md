# Quiz App - Contribution Analysis & Issues Report (Batch Service - Task 2)

## 📊 Project Overview

**Project:** Batch Service Microservice  
**Total Contributors:** 6 (AnkushSaha01, kaif1119, suryakumarsirvi, Madeshiya22, khaliddotio, shobhit2603)  
**Final Status:** ✅ Fully Completed

---

## 👥 Contributors & Their Contributions

### 1. **AnkushSaha01** ⭐⭐⭐⭐ 

**PR:** #23  
**Contribution:** Core Data Models & Base Configuration

**What They Built:**
- ✅ `batch.model.js` (Batch Schema with soft delete and compound indexing)
- ✅ `enrollment.model.js` (Enrollment Schema for the relationship between students and batches)
- ✅ `env.config.js` and `db.config.js` (Environment variable and DB connection setup)
- ✅ `app.js` and `server.js` (Server initialization)

**Issues in Their Code:**
- ❌ **BUG in Enrollment Model:** The unique constraint on the student ID prevented multiple students from joining the same batch correctly. The index was incorrectly implemented as `{unique: true}` on a single field (fixed during integration).

**Impact:** Provided the foundational models and configurations to kickstart the batch service.

---

### 2. **kaif1119** ⭐⭐⭐⭐ 

**PR:** #25  
**Contribution:** Batch Repository implementation

**What They Built:**
- ✅ `batch.repository.js` (Data access layer for batches)
- ✅ Clean abstraction using `create`, `findById`, `findByName`, `findAll`, `updateById`, and `softDelete`.
- ✅ Maintained data integrity by properly filtering with `isDeleted: false` in read queries.

**Impact:** Ensured smooth and clean separation between the database operations and the service logic.

---

### 3. **suryakumarsirvi** ⭐⭐⭐⭐⭐ 

**PR:** #26  
**Contribution:** Business Logic and Custom Error Handling

**What They Built:**
- ✅ `batch.service.js` (Handles core business rules for creating and deleting batches)
- ✅ `ApiError.js` (Standardized custom error class for throwing HTTP errors)
- ✅ Added safety checks: Prevents duplicate batch names and guards against deleting batches that still have active enrolled students.
- ✅ Implemented proper ID validation.

**Impact:** Ensured that the service layer is robust, validating input constraints before delegating to the repository.

---

### 4. **Madeshiya22** ⭐⭐⭐⭐ 

**PR:** #28  
**Contribution:** Input Validation System

**What They Built:**
- ✅ `zod.validator.js` (Defined Zod schemas for batches and student enrollments)
- ✅ Implemented cross-field validation rules (e.g., ensuring `endDate` occurs after `startDate`).
- ✅ `zod.middleware.js` (Created reusable Express middleware to parse and validate request bodies automatically).

**Impact:** Shifted data validation to the router/middleware level, keeping the controllers clean.

---

### 5. **khaliddotio** ⭐⭐⭐⭐⭐

**PR:** Implemented Issue #18
**Contribution:** Batch CRUD Controller Handlers

**What They Built:**
- ✅ `batch.controller.js` (Implemented `handleCreateBatch`, `handleGetAllBatches`, `handleGetBatchById`, `handleUpdateBatch`, `handleDeleteBatch`).
- ✅ Linked controller actions securely to the `batch.service.js` layer.
- ✅ `asyncHandler.js` (Created utility for clean asynchronous error handling).

**Impact:** Successfully connected the API requests to the service layer, completing the core CRUD features for Batches.

---

### 6. **Shobhit Shrivastava (shobhit2603)** ⭐⭐⭐⭐⭐

**PR:** #32 (Issue #19)
**Contribution:** Student Assignment APIs & Routes

**What They Built:**
- ✅ `batch.controller.js` (Implemented student assignment logic: `addStudent`, `removeStudent`, `getStudents`).
- ✅ `batch.routes.js` (Defined all endpoints connecting the validation middleware, authentication, and controllers).
- ✅ Cleaned up the app configuration by connecting the main batch routes router to the application.

**Impact:** Completed the crucial functionality of assigning and managing students in batches, officially tying the entire Batch Service together.

---

## 🚀 Final Status

**Backend (Batch Service):** ✅ Production Ready
- Models: ✅ Done (AnkushSaha01)
- Repositories: ✅ Done (kaif1119)
- Services: ✅ Done (suryakumarsirvi)
- Validations: ✅ Done (Madeshiya22)
- Controllers: ✅ Done (khaliddotio & shobhit2603)
- Routes: ✅ Done (shobhit2603)
- Integration: ✅ Fully Integrated

---

**Generated:** May 17, 2026  
**Project:** Quiz App - Batch Service Microservice  
**Organization:** still-KODR
