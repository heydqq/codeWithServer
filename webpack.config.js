const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build']
const SpeedMesurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMesurePlugin();
const webpackConfig = {
    mode: isDev ?  "development" : 'production',
    entry:['./src/index.ts','./src/moreEntry.ts'],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 9009,
    },
    module: {
        rules:[
            {
                test:/\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    // {
                    //     loader: path.join(__dirname,'./loader/dqqLoader.js')
                    // },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env','@babel/preset-typescript'],
                            plugins: ['@babel/plugin-proposal-class-properties','@babel/plugin-transform-runtime']
                        }
                    },
                ],
            },
            {
                test:/\.scss/,
                exclude: /node_modules/,
                use:[
                    'style-loader',//动态创建style标签，将css插入head中
                    'css-loader', //处理@import 
                    // 'postcss-loader',//生成浏览器兼容前缀
                    'sass-loader' //解析scss-》css
                ]
            }
        ]
    },
    optimization:{
        splitChunks:{
            cacheGroups:{
                common: {
                    //公共模块
                    chunks: 'initial',
                    name: 'common',
                    minSize: 100, //大小超过100个字节
                    minChunks: 1 //最少引入了3次
                },
                runtimeChunk: {
                    name: 'manifest'
                }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin ({
            config:config.template,
            template:path.resolve(__dirname,'./public/index.html')
        }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('npnp'),
        //     HOST:JSON.stringify('hehe')
        // })
    ],
    resolve: {
        extensions: ['.ts','.tsx','.wasm', '.mjs', '.js', '.json']
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename:'[name].bundle.[hash:7].js',
        clean:true,
    },
}

module.exports = smp.wrap(webpackConfig)