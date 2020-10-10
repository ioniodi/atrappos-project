// /client/src/setupProxy.js

const {createProxyMiddleware} = require('http-proxy-middleware')

const options = {
    target: 'http://localhost:5000',
    secure: false,
    changeOrigin: true
};

module.exports = function(app) {
    app.use('/api/*', createProxyMiddleware(options));
    app.use('/api/paths/*', createProxyMiddleware(options));
    app.use('/api/users/*', createProxyMiddleware(options));
}
