import express from 'express';
import { getMedia, createMedia } from '../controllers/mediaController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Define the routes
router.get('/', authMiddleware, getMedia);
router.post('/', authMiddleware, createMedia);

export default router; // Default export
