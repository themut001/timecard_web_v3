import { Router } from 'express';
import { login, logout, refreshToken, getCurrentUser, forgotPassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// POST /api/auth/login
router.post('/login', asyncHandler(login));

// POST /api/auth/logout
router.post('/logout', authenticate, asyncHandler(logout));

// POST /api/auth/refresh
router.post('/refresh', asyncHandler(refreshToken));

// GET /api/auth/me
router.get('/me', authenticate, asyncHandler(getCurrentUser));

// POST /api/auth/forgot-password
router.post('/forgot-password', asyncHandler(forgotPassword));

export default router;