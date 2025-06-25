import { Router } from 'express';
import {
  getAllEmployees,
  getAllAttendance,
  updateAttendance,
  getMonthlyReports,
  getTagEffortsSummary,
  getSyncStatus,
  syncNotionTags
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/admin/employees
router.get('/employees', authenticate, requireAdmin, asyncHandler(getAllEmployees));

// GET /api/admin/attendance/all?date=2025-01-15
router.get('/attendance/all', authenticate, requireAdmin, asyncHandler(getAllAttendance));

// PUT /api/admin/attendance/:id
router.put('/attendance/:id', authenticate, requireAdmin, asyncHandler(updateAttendance));

// GET /api/admin/reports/monthly
router.get('/reports/monthly', authenticate, requireAdmin, asyncHandler(getMonthlyReports));

// GET /api/admin/tags/efforts
router.get('/tags/efforts', authenticate, requireAdmin, asyncHandler(getTagEffortsSummary));

// GET /api/admin/tags/sync-status
router.get('/tags/sync-status', authenticate, requireAdmin, asyncHandler(getSyncStatus));

// POST /api/admin/tags/sync
router.post('/tags/sync', authenticate, requireAdmin, asyncHandler(syncNotionTags));

export default router;