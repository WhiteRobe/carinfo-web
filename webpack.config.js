const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  // 解决编译环境 : webpack You are using the runtime-only build of Vue where the template compiler is not available
  resolve: {
    alias: {
        'vue': 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        // 它会应用到普通的 `.js` 文件
        // 以及 `.vue` 文件中的 `<script>` 块
        {
          test: /\.js$/,
          loader: 'babel-loader'
        },
        // 它会应用到普通的 `.css` 文件
        // 以及 `.vue` 文件中的 `<style>` 块
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        }
      ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin()
  ]
};