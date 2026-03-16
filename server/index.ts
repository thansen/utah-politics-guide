import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import proxyRouter from './proxy';
import enrichedRouter from './enriched';

const app = express();
const PORT = process.env.SERVER_PORT || 3100;

app.use('/api/proxy', proxyRouter);
app.use('/api/enriched', enrichedRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Cache server listening on http://localhost:${PORT}`);
});
