import express from 'express'; // Use import instead of require
import { registerUser, loginUser } from '../controllers/authController.js'; // Use .js extension

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router; // Use export default
