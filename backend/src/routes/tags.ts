import { Router } from 'express';
import {
  getAllTags,
  getActiveTags,
  searchTags,
  syncNotionTags
} from '../controllers/tagsController';
import { authenticate, requireAdmin } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// GET /api/tags
router.get('/', authenticate, asyncHandler(getAllTags));

// GET /api/tags/active
router.get('/active', authenticate, asyncHandler(getActiveTags));

// GET /api/tags/search?q=keyword
router.get('/search', authenticate, asyncHandler(searchTags));

// POST /api/tags/sync (Admin only)
router.post('/sync', authenticate, requireAdmin, asyncHandler(syncNotionTags));

export default router;