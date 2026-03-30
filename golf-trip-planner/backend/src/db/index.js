const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'golf_trip_planner',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  process.exit(1);
});

/**
 * Execute a parameterised query. Always use $1, $2... placeholders
 * to prevent SQL injection — never interpolate user input directly.
 */
async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

module.exports = { query };
