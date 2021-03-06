const path = require('path')
const glob = require('glob')
const UglifyPlugin = require('uglifyjs-webpack-plugin') // 压缩js文件，减少js文件大小
const HtmlPlugin = require('html-webpack-plugin')  // 把html中的双引号单引号去除
const ExtractTextPlugin = require('extract-text-webpack-plugin')  // 抽取css样式，防止将样式打包在js中引起页面样式加载错落的现象
const PurifyCSSPlugin = require("purifycss-webpack") // 清理无用的css，要添加在ExtractTextPlugin之后
const entry = require('./webpack_config/entry_webpack')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')  // 复制文件，比如放置到public目录中，可以直接访问

let website
if (process.env.type == 'build') {
    website = {
        publicPath: "http://test.com:1717/"
    }
} else {
    website = {
        publicPath: "http://localhost:9527/"
    }
}

module.exports = {
    devtool: 'source-map',
    entry: entry.path,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: website.publicPath
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // use: [
                //     'style-loader',
                //     { loader: 'css-loader', options: { importLoaders: 1 } },
                //     'postcss-loader'
                // ]
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {importLoaders: 1}
                    },
                    "postcss-loader"]
                })
            },
            {
                test: /\.(png|jpg|gif|jpeg)/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 5000,
                            outputPath: 'images/',
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.(htm|html)$/i,
                loader: ['html-withimg-loader']
            },
            {
                test: /\.less$/,
                // use: [{
                //     loader: "style-loader"
                // },{
                //     loader: "css-loader"
                // },{
                //     loader: "less-loader"
                // }]
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    },{
                        loader: "less-loader"
                    }]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader"
                    },{
                        loader: "sass-loader"
                    }]
                })
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: __dirname + '/src/public',
            to: './public'
        }]),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['jquery', 'vue'],
            filename: "assets/js/[name].js",
            minChunks: 2
        }),
        new webpack.ProvidePlugin({
            $: "jquery"
        }),
        // new UglifyPlugin(),
        new HtmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: './src/index.html'
        }),
        new ExtractTextPlugin("css/style.css"),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        }),
        new webpack.BannerPlugin('BINCAI学习')
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: 'localhost',
        compress: true,
        port: 9527
    },
    watchOptions: {
        poll: 1000,  // 多久检测更新一次
        aggregateTimeout: 500, // 防止重复保存出错，半秒钟内按ctrl+s只触发一次,
        ignored: /node_modules/, // 不监测哪些文件夹
    }
}