const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'CP Group Code Editor',
    },
  },
  lintOnSave: false,

  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },

  transpileDependencies: ['vuetify'],
};
