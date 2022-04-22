const { defineConfig } = require('@vue/cli-service')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
let cesiumSource = './node_modules/cesium/Source'

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint 是否在保存时检查
  assetsDir: 'static', // 配置js、css静态资源二级目录的位置
  devServer: {
    // proxy: {
    //   '/cnterrain20':{
    //     target:'http://10.0.200.201:8083'
    //   }
    // }
  },
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    resolve: {
      alias: {
        '@': path.resolve('src'),
        'cesium': path.resolve(__dirname, cesiumSource)
      }
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.join(cesiumSource, 'Workers'), to: 'Workers' },
          { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
          { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' },
          { from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' },
        ],
      }),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Workers'), to: 'Workers'}]),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
      // new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers'}]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      rules: [
        // {
        //   test: /\.js$/,
        //   use: {
        //     loader: '@open-wc/webpack-import-meta-loader',
        //   },
        // },
      ]
    },
  }

})