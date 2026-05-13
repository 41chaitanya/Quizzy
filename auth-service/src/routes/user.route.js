import express from 'express';
import { registerController } from '../controllers/auth.controller.js';

const router = express.Router();

// Route for user registration
router.post('/register', registerController);

export default router;