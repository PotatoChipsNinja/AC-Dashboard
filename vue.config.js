module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://zekin.wang:8000',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
