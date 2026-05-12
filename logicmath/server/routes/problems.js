import { Router } from 'express';
import { generate, checkAnswer } from '../controllers/problemsController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/generate', generate);
router.post('/:id/check', optionalAuth, checkAnswer);

export default router;
