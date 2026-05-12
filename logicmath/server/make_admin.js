import pool from './db/pool.js';

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email. Example: node make_admin.js your@email.com');
  process.exit(1);
}

const makeAdmin = async () => {
  try {
    const res = await pool.query('UPDATE users SET role = $1 WHERE email = $2 RETURNING *', ['admin', email]);
    if (res.rowCount === 0) {
      console.log(` User with email ${email} not found.`);
    } else {
      console.log(` User ${res.rows[0].username} (${email}) now has ADMIN rights!`);
      console.log(`⚠Please re-login (Logout -> Login) to update your access token.`);
    }
  } catch (err) {
    console.error(' Error:', err.message);
  } finally {
    pool.end();
  }
};

makeAdmin();
