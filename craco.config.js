const path = require('path')
module.exports = {
  devServer: {
    port: 9528,
    open: true,
    proxy: {
      '/api': {
        target: 'http://rap2api.taobao.org/app/mock/275070',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    }
  },
	babel: {
    plugins: [
      ["@babel/plugin-proposal-decorators", {legacy: true}]
    ]
  },
  webpack: {
    alias: {
      '@': path.join(__dirname, 'src'), 
      'pages': path.join(__dirname, 'src/pages'),
      'utils': path.join(__dirname, 'src/utils'),
      'components': path.join(__dirname, 'src/components'),
      'api': path.join(__dirname, 'src/api'),
      'store': path.join(__dirname, 'src/store')
    }
  }
}
