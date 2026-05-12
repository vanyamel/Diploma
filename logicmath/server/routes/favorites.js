import { Router } from 'express';
import { toggleFavorite, getFavorites, checkFavorite } from '../controllers/favoritesController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', getFavorites);
router.post('/toggle', toggleFavorite);
router.get('/:problemId/check', checkFavorite);

export default router;
