import { Router } from 'express';
import pool from './db';

const TOKEN = process.env.UTAH_LEG_API_KEY || '';
const UPSTREAM_BASE = 'https://glen.le.utah.gov';

const router = Router();

/**
 * GET /bills/:session
 * Returns the bill list enriched with any cached bill-detail data.
 */
router.get('/bills/:session', async (req, res) => {
  const { session } = req.params;

  try {
    // 1. Fetch the bill list (via internal proxy to benefit from caching)
    const listUrl = `http://localhost:${process.env.SERVER_PORT || 3100}/api/proxy/utah-leg/bills/${session}/billlist/${TOKEN}`;
    const listRes = await fetch(listUrl, {
      headers: { 'X-Endpoint-Id': 'bill-list' },
    });
    if (!listRes.ok) {
      res.status(listRes.status).json({ error: 'Failed to fetch bill list' });
      return;
    }
    const listJson = await listRes.json();
    const rawBills: any[] = Array.isArray(listJson?.bills ?? listJson)
      ? (listJson?.bills ?? listJson)
      : Object.values(listJson?.bills ?? listJson);

    // 2. Query all cached bill-detail entries for this session
    const urlPattern = `${UPSTREAM_BASE}/bills/${session}/%/${TOKEN}`;
    const cacheResult = await pool.query(
      `SELECT response_data FROM api_cache
       WHERE source = 'utah-leg'
         AND endpoint_id = 'bill-detail'
         AND request_url LIKE $1
         AND fetched_at + (ttl_seconds || ' seconds')::interval > NOW()`,
      [urlPattern],
    );

    // 3. Build lookup map by bill number
    const detailMap = new Map<string, any>();
    for (const row of cacheResult.rows) {
      const d = typeof row.response_data === 'string'
        ? JSON.parse(row.response_data)
        : row.response_data;
      const key = d.billNumber ?? d.billNumberLong ?? '';
      if (key) detailMap.set(key, d);
    }

    // 4. Merge: enrich each bill list row with cached detail fields
    const enriched = rawBills.map((b) => {
      const billNumber = b.number ?? b.bill ?? '';
      const detail = detailMap.get(billNumber);
      return {
        ...b,
        bill: billNumber,
        shorttitle: detail?.shortTitle ?? '',
        sponsor: detail?.primeSponsorName ?? '',
        floor_sponsor: detail?.floorSponsorName ?? '',
        last_action: detail?.lastAction ?? '',
        last_action_date: detail?.lastActionDate ?? b.lastActionTime ?? '',
        _enriched: !!detail,
      };
    });

    res.json({
      bills: enriched,
      total: enriched.length,
      enrichedCount: cacheResult.rows.length,
    });
  } catch (err: any) {
    console.error('Enriched bill list error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

export default router;
