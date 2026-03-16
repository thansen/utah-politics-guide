export default {
  dev: {
    '/api/proxy/': {
      target: 'http://localhost:3100',
      changeOrigin: true,
    },
    '/api/enriched/': {
      target: 'http://localhost:3100',
      changeOrigin: true,
    },
  },
};
