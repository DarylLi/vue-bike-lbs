var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
var autoOpenBrowser = !!config.dev.autoOpenBrowser
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware

var server = express()

//设置跨域访问  
// server.all('*', function(req, res, next) {  
//     res.header("Access-Control-Allow-Origin", "*");  
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
//     res.header("X-Powered-By",' 3.2.1')  
//     res.header("Content-Type", "application/json;charset=utf-8");  
//     next();  
// });

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
    // force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        })
        cb()
    })
})

var context = config.dev.context
var proxypath = config.dev.proxypath

var options = {
    target: proxypath,
    changeOrigin: true,
}
if (context.length) {
    server.use(proxyMiddleware(context, options))
}

// server.use(proxyMiddleware('/*/*', {
//     target: 'https://mainsite-restapi.ele.me',
//     changeOrigin: true,
//     secure: false,
// }))


// handle fallback for HTML5 history API
server.use(require('connect-history-api-fallback')())

// serve webpack bundle output
server.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
server.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
server.use(staticPath, express.static('./static'))
    //Add /mock for mock data, eg:http://localhost:8088/mock/nextScore.json
server.use('/mock', express.static('./mock'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
    console.log('> Listening at ' + uri + '\n')
        // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        // opn(uri)
    }
    _resolve()
})

var app = server.listen(port)

module.exports = {
        ready: readyPromise,
        close: () => {
            app.close()
        }
    }
    // server.use(staticPath, express.static('./static'))

// module.exports = server.listen(port, function(err) {
//     if (err) {
//         console.log(err)
//         return
//     }
//     var uri = 'http://localhost:' + port
//     console.log('Listening at ' + uri + '\n')

//     // when env is testing, don't need open it
//     if (process.env.NODE_ENV !== 'testing') {
//         //opn(uri)
//     }
// })