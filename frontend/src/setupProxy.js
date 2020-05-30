const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy.createProxyMiddleware('/api', {
      target: 'http://localhost:8000/',
      changeOrigin: true
    })
  );
  app.use(
	proxy.createProxyMiddleware('/ws',{
		target: 'ws://localhost:8000/',
		ws:true,
		changeOrigin: true
	})
  );
};
