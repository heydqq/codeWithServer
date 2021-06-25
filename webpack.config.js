const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode:"development",
    entry:'./src/index.ts',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: 9009,
    },
    module: {
        rules:[
            {
                test:/\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: path.join(__dirname,'./loader/dqqLoader.js')
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-class-properties','@babel/plugin-transform-runtime']
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin ({
            title:'heihei',
            template:path.resolve(__dirname,'./public/index.html')
        })
    ],
    resolve: {
        extensions: ['.ts','.tsx','.wasm', '.mjs', '.js', '.json']
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename:'[name].bundle.js',
        clean:true,
    },
}