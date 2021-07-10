const path = require('path')
module.exports = {
  devServer: {
    port: 9528,
    open: true,
    disableHostCheck: true,
    https: false, // https:{type:Boolean}
    proxy: {
      '/mms': {
        target: 'http://test.cms.tvplus.club',
        changeOrigin: true,
        pathRewrite: {
          '^/mms': '/mms'
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
