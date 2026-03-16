import pool from './db';

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS api_cache (
      id            SERIAL PRIMARY KEY,
      source        TEXT NOT NULL,
      endpoint_id   TEXT NOT NULL,
      cache_key     TEXT NOT NULL UNIQUE,
      request_url   TEXT NOT NULL,
      params        JSONB,
      response_data JSONB NOT NULL,
      status_code   INTEGER NOT NULL,
      fetched_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ttl_seconds   INTEGER NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_cache_key ON api_cache (cache_key);
    CREATE INDEX IF NOT EXISTS idx_cache_source_endpoint ON api_cache (source, endpoint_id);
  `);
  console.log('Database initialized');
  await pool.end();
  process.exit(0);
}

init().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
