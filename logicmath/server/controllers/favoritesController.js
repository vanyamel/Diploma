import pool from '../db/pool.js';

export async function toggleFavorite(req, res) {
  const { problemId } = req.body;
  const { userId } = req.user;

  try {
    const checkRes = await pool.query('SELECT * FROM favorites WHERE user_id = $1 AND problem_id = $2', [userId, problemId]);
    
    if (checkRes.rows.length > 0) {
      await pool.query('DELETE FROM favorites WHERE user_id = $1 AND problem_id = $2', [userId, problemId]);
      return res.json({ isFavorite: false, message: 'Видалено з обраного' });
    } else {
      await pool.query('INSERT INTO favorites (user_id, problem_id) VALUES ($1, $2)', [userId, problemId]);
      return res.json({ isFavorite: true, message: 'Додано до обраного' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при зміні статусу обраного' });
  }
}

export async function getFavorites(req, res) {
  const { userId } = req.user;
  try {
    const q = `
      SELECT p.id, p.category, p.level, p.title, p.description, p.xp_reward, f.created_at
      FROM favorites f
      JOIN problems p ON f.problem_id = p.id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
    `;
    const result = await pool.query(q, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка при отриманні обраного' });
  }
}

export async function checkFavorite(req, res) {
  const { problemId } = req.params;
  const { userId } = req.user;
  try {
    const checkRes = await pool.query('SELECT * FROM favorites WHERE user_id = $1 AND problem_id = $2', [userId, problemId]);
    res.json({ isFavorite: checkRes.rows.length > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Помилка перевірки обраного' });
  }
}
