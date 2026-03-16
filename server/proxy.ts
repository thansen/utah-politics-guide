import { Router } from 'express';
import { createHash } from 'crypto';
import { getFromCache, storeInCache } from './cache';
import { TTL_SECONDS, DEFAULT_TTL } from './ttl-config';

const TARGETS: Record<string, { baseUrl: string; auth?: () => string }> = {
  'utah-leg': { baseUrl: 'https://glen.le.utah.gov' },
  'legiscan': { baseUrl: 'https://api.legiscan.com' },
  'open-data': {
    baseUrl: 'https://opendata.utah.gov',
    auth: () => {
      const creds = process.env.OPEN_DATA_AUTH || '';
      return 'Basic ' + Buffer.from(creds).toString('base64');
    },
  },
  'ugrc': { baseUrl: 'https://api.mapserv.utah.gov' },
};

function buildCacheKey(source: string, endpointId: string, pathAndQuery: string): string {
  const normalized = `${source}::${endpointId}::${pathAndQuery}`;
  return createHash('sha256').update(normalized).digest('hex');
}

const router = Router();

router.all('/:source/{*rest}', async (req, res) => {
  const source = req.params.source;
  const target = TARGETS[source];

  if (!target) {
    res.status(404).json({ error: `Unknown source: ${source}` });
    return;
  }

  const endpointId = (req.headers['x-endpoint-id'] as string) || 'unknown';
  // Everything after /api/proxy/:source
  const remainingPath = req.url.replace(`/${source}`, '');
  const externalUrl = target.baseUrl + remainingPath;

  const ttlKey = `${source}::${endpointId}`;
  const ttlSeconds = TTL_SECONDS[ttlKey] ?? DEFAULT_TTL;
  const cacheKey = buildCacheKey(source, endpointId, remainingPath);

  // Check cache
  try {
    const cached = await getFromCache(cacheKey);
    if (cached) {
      const ageSeconds = Math.round((Date.now() - cached.fetchedAt.getTime()) / 1000);
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Age', String(ageSeconds));
      res.set('X-Cache-TTL', String(cached.ttlSeconds));
      res.status(cached.statusCode).json(cached.data);
      return;
    }
  } catch (err) {
    console.error('Cache lookup error:', err);
    // Fall through to fetch from upstream
  }

  // Fetch from upstream
  try {
    const headers: Record<string, string> = {};
    if (target.auth) {
      headers['Authorization'] = target.auth();
    }

    const upstream = await fetch(externalUrl, { headers });
    const contentType = upstream.headers.get('content-type') || '';
    let data: any;

    if (contentType.includes('json')) {
      data = await upstream.json();
    } else {
      data = await upstream.text();
    }

    // Store in cache (only for successful responses)
    if (upstream.status >= 200 && upstream.status < 300) {
      try {
        await storeInCache(source, endpointId, cacheKey, externalUrl, null, data, upstream.status, ttlSeconds);
      } catch (err) {
        console.error('Cache store error:', err);
      }
    }

    res.set('X-Cache', 'MISS');
    res.set('X-Cache-TTL', String(ttlSeconds));
    res.status(upstream.status);

    if (contentType.includes('json')) {
      res.json(data);
    } else {
      res.type(contentType).send(data);
    }
  } catch (err: any) {
    console.error('Upstream fetch error:', err);
    res.status(502).json({ error: 'Failed to fetch from upstream', details: err.message });
  }
});

export default router;
