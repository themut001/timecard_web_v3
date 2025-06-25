import { Router } from 'express';
import {
  getDailyReport,
  saveDailyReport,
  updateDailyReport,
  getDailyReports,
  getEffortSummary
} from '../controllers/reportsController';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/reports/daily?date=2025-01-15
router.get('/daily', authenticate, asyncHandler(getDailyReport));

// POST /api/reports/daily
router.post('/daily', authenticate, asyncHandler(saveDailyReport));

// PUT /api/reports/daily/:id
router.put('/daily/:id', authenticate, asyncHandler(updateDailyReport));

// GET /api/reports/daily/list
router.get('/daily/list', authenticate, asyncHandler(getDailyReports));

// GET /api/efforts/summary
router.get('/efforts/summary', authenticate, asyncHandler(getEffortSummary));

export default router;