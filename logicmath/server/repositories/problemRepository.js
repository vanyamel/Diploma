import pool from '../db/pool.js';

export default class ProblemRepository {
  async createProblem(problemData) {
    const { category, level, title, description, params_json, answer_json, steps_json, xp_reward } = problemData;
    const result = await pool.query(
      `INSERT INTO problems (category, level, title, description, params_json, answer_json, steps_json, xp_reward) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [category, level, title, description, JSON.stringify(params_json), JSON.stringify(answer_json), JSON.stringify(steps_json), xp_reward]
    );
    return result.rows[0].id;
  }

  async findById(id) {
    const result = await pool.query('SELECT * FROM problems WHERE id = $1', [id]);
    return result.rows[0];
  }
}
