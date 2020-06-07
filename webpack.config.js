const path = require('path')
const glob = require('glob')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require("purifycss-webpack")
const entry = require('./webpack_config/entry_webpack')

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
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        host: 'localhost',
        compress: true,
        port: 9527
    }
}