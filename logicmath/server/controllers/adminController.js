import pool from '../db/pool.js';

export const getStats = async (req, res, next) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const problemsCount = await pool.query('SELECT COUNT(*) FROM problems');
    const attemptsCount = await pool.query('SELECT COUNT(*) FROM attempts');

    res.json({
      users: parseInt(usersCount.rows[0].count, 10),
      problems: parseInt(problemsCount.rows[0].count, 10),
      attempts: parseInt(attemptsCount.rows[0].count, 10),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, email, username, role, xp_total, is_verified, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id === req.user.userId) {
      return res.status(400).json({ error: 'Ви не можете видалити власний акаунт' });
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Користувача успішно видалено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
