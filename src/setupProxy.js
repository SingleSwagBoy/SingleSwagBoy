const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    proxy.createProxyMiddleware('/mms', {  //`api`是需要转发的请求 
      target: 'http://test.cms.tvplus.club',  // 这里是接口服务器地址
      changeOrigin: true,
      pathRewrite: {'^/mms': '/mms'}
    })
  )
}