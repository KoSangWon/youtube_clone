const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',//target을 5000번포트로 주겠다.
      changeOrigin: true,
    })
  );
};