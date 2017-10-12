// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
console.log('path is:' + path.resolve(__dirname, '../lbs/index.html'))
module.exports = {
    build: {
        env: {
            NODE_ENV: '"production"'
        },
        index: path.resolve(__dirname, '../lbs/index.html'),
        assetsRoot: path.resolve(__dirname, '../lbs'),
        assetsSubDirectory: 'release/static',
        assetsPublicPath: './', //assetsPubicPath + assetsSubDirectory
        productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: {
            NODE_ENV: '"development"'
        },
        port: 80,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '',
        context: [ //代理路径

        ],
        // proxypath: 'https://mainsite-restapi.ele.me',
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}