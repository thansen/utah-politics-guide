export default {
  dev: {
    '/proxy/utah-leg/': {
      target: 'https://glen.le.utah.gov',
      changeOrigin: true,
      pathRewrite: { '^/proxy/utah-leg': '' },
    },
    '/proxy/legiscan/': {
      target: 'https://api.legiscan.com',
      changeOrigin: true,
      pathRewrite: { '^/proxy/legiscan': '' },
    },
    '/proxy/open-data/': {
      target: 'https://opendata.utah.gov',
      changeOrigin: true,
      pathRewrite: { '^/proxy/open-data': '' },
      auth: 'c10cg52qydqwucco2qijiryno:3ycn7wasery3mfjrwudbrl1vqpjnto6qgig91wrhlw1wxcru4b',
    },
    '/proxy/ugrc/': {
      target: 'https://api.mapserv.utah.gov',
      changeOrigin: true,
      pathRewrite: { '^/proxy/ugrc': '' },
    },
  },
};
