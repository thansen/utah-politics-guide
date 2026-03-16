import pool from './db';

interface CacheHit {
  data: any;
  statusCode: number;
  fetchedAt: Date;
  ttlSeconds: number;
}

export async function getFromCache(cacheKey: string): Promise<CacheHit | null> {
  const result = await pool.query(
    `SELECT response_data, status_code, fetched_at, ttl_seconds
     FROM api_cache
     WHERE cache_key = $1
       AND fetched_at + (ttl_seconds || ' seconds')::interval > NOW()
     LIMIT 1`,
    [cacheKey],
  );

  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  return {
    data: row.response_data,
    statusCode: row.status_code,
    fetchedAt: row.fetched_at,
    ttlSeconds: row.ttl_seconds,
  };
}

export async function storeInCache(
  source: string,
  endpointId: string,
  cacheKey: string,
  requestUrl: string,
  params: Record<string, any> | null,
  data: any,
  statusCode: number,
  ttlSeconds: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO api_cache (source, endpoint_id, cache_key, request_url, params, response_data, status_code, ttl_seconds, fetched_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     ON CONFLICT (cache_key) DO UPDATE SET
       response_data = EXCLUDED.response_data,
       status_code = EXCLUDED.status_code,
       ttl_seconds = EXCLUDED.ttl_seconds,
       fetched_at = NOW()`,
    [source, endpointId, cacheKey, requestUrl, params ? JSON.stringify(params) : null, JSON.stringify(data), statusCode, ttlSeconds],
  );
}
