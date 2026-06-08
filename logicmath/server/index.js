import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import pool from './db/pool.js';


const PORT = process.env.PORT || 3001;

// Check DB connection before start
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  }
  console.log('Successfully connected to PostgreSQL database.');
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
