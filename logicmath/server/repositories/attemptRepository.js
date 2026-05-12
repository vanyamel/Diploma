import pool from '../db/pool.js';

export default class AttemptRepository {
  // Save attempt and award XP in a single transaction
  async saveAttemptWithXP({ userId, problemId, userAnswer, isCorrect, hintsUsed, timeSpent, xpEarned }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // 1. Save attempt
      await client.query(
        `INSERT INTO attempts (user_id, problem_id, user_answer, is_correct, hints_used, time_spent, xp_earned)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [userId, problemId, userAnswer, isCorrect, hintsUsed, timeSpent, xpEarned]
      );
      
      let newXpTotal = null;
      // 2. Update user XP if authenticated and earned XP
      if (userId && xpEarned > 0) {
        const xpResult = await client.query(
          'UPDATE users SET xp_total = xp_total + $1 WHERE id = $2 RETURNING xp_total',
          [xpEarned, userId]
        );
        newXpTotal = xpResult.rows[0]?.xp_total;
      } else if (userId) {
        // If no XP earned, return current XP
        const xpResult = await client.query('SELECT xp_total FROM users WHERE id = $1', [userId]);
        newXpTotal = xpResult.rows[0]?.xp_total;
      }
      
      await client.query('COMMIT');
      return newXpTotal;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getUserProgress(userId) {
    const result = await pool.query(
      `SELECT DISTINCT p.category, p.level
       FROM attempts a
       JOIN problems p ON a.problem_id = p.id
       WHERE a.user_id = $1 AND a.is_correct = true`,
      [userId]
    );
    
    const progress = {};
    result.rows.forEach(row => {
      if (!progress[row.category]) progress[row.category] = {};
      progress[row.category][row.level] = true;
    });
    return progress;
  }
}
