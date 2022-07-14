'use strict'
const path = require('path')
const { ESBuildMinifyPlugin } = require('esbuild-loader')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "@/assets/scss/custom.scss";
        `
      }
    }
  },
  lintOnSave: import.meta.env.NODE_ENV !== 'production',
  configureWebpack: (config) => {
    config.plugins.push(new SpeedMeasurePlugin())
  },
  chainWebpack: config => {
    const jsRule = config.module.rule('js')

    jsRule.uses.clear()

    jsRule
      .use('esbuild-loader')
      .loader('esbuild-loader')
      .options({
        target: [
          'es2015'
        ]
      })

    config.optimization.minimizers.delete('terser')

    config.optimization
      .minimizer('esbuild')
      .use(ESBuildMinifyPlugin, [{ minify: true }])

    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'SYNC 新聞同步'
        return args
      })

    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()

    config.module
      .rule('icons')
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
      .end()
  }
}
