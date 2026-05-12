import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import UserRepository from '../repositories/userRepository.js';

const router = Router();
const userRepository = new UserRepository();

// GET /api/leaderboard  top players
router.get('/', async (req, res) => {
  try {
    const board = await userRepository.getLeaderboard(20);
    res.json({ leaderboard: board });
  } catch (err) {
    console.error('[leaderboard]', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
