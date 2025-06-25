import { Router } from 'express';
import {
  getTodayAttendance,
  clockIn,
  clockOut,
  getAttendanceHistory,
  getAttendanceSummary
} from '../controllers/attendanceController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/attendance/today
router.get('/today', authenticate, asyncHandler(getTodayAttendance));

// POST /api/attendance/clock-in
router.post('/clock-in', authenticate, asyncHandler(clockIn));

// POST /api/attendance/clock-out
router.post('/clock-out', authenticate, asyncHandler(clockOut));

// GET /api/attendance/history
router.get('/history', authenticate, asyncHandler(getAttendanceHistory));

// GET /api/attendance/summary
router.get('/summary', authenticate, asyncHandler(getAttendanceSummary));

export default router;