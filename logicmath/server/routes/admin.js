import { Router } from 'express';
import { getStats, getUsers, deleteUser } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = Router();

// All routes protected by requireAuth and requireAdmin
router.use(requireAuth, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

export default router;
