import pool from '../db/pool.js';

export default class UserRepository {
  async createUser({ email, username, passwordHash, verificationToken }) {
    const result = await pool.query(
      'INSERT INTO users (email, username, password_hash, verification_token) VALUES ($1, $2, $3, $4) RETURNING id, email, username, role, xp_total',
      [email, username, passwordHash, verificationToken]
    );
    return result.rows[0];
  }

  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findById(id) {
    const result = await pool.query('SELECT id, email, username, role, xp_total, is_verified FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByVerificationToken(token) {
    const result = await pool.query('SELECT * FROM users WHERE verification_token = $1', [token]);
    return result.rows[0];
  }

  async markAsVerified(id) {
    await pool.query('UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE id = $1', [id]);
  }

  async setResetToken(email, token, expiresAt) {
    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [token, expiresAt, email]
    );
  }

  async findByResetToken(token) {
    const result = await pool.query('SELECT * FROM users WHERE reset_token = $1', [token]);
    return result.rows[0];
  }

  async updatePassword(userId, passwordHash) {
    await pool.query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
      [passwordHash, userId]
    );
  }

  async addXP(userId, xp) {
    const result = await pool.query(
      'UPDATE users SET xp_total = xp_total + $1 WHERE id = $2 RETURNING xp_total',
      [xp, userId]
    );
    return result.rows[0]?.xp_total;
  }

  async getLeaderboard(limit = 20) {
    const result = await pool.query(
      `SELECT id, username, xp_total,
              RANK() OVER (ORDER BY xp_total DESC) AS rank
       FROM users
       ORDER BY xp_total DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}
