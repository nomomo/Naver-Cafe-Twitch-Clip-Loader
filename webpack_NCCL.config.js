/* eslint-disable no-undef */
const path = require('path');
const WebpackUserscript = require('webpack-userscript');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var PACKAGE = require('./package.json');
const my_project_name = "Naver-Cafe-Clip-Loader";//PACKAGE.name;

console.log("__dirname", __dirname);

module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname),
        filename: my_project_name+'.js'
    },
    resolve: {
        modules: [
            path.join(__dirname, "src"),
            "node_modules"
        ]
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: [{
                loader: 'css-loader',
                options: {
                    esModule: false
                }
            }],
        }, 
        // TypeScript 로더 설정
        {
            test: /\.tsx?$/i,
            exclude: /node_modules/,
            use: ['ts-loader']
        },],
    },
    optimization: {
        minimize: process.env.NODE_ENV === "production" ? true : false,
        minimizer: [new TerserPlugin({
            extractComments: false,
            terserOptions: {
                format: {
                    comments: false,
                }
            }
        })]
    },
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             uglifyOptions: {
    //                 output: {
    //                     comments: process.env.NODE_ENV === "production" ? false : false,
    //                     beautify: process.env.NODE_ENV === "production" ? false : true,
    //                 },
    //                 mangle: false,
    //                 compress: process.env.NODE_ENV === "production" ? true : false
    //             },
    //         }),
    //     ],
    // },
    plugins: [
        new WebpackUserscript({
            headers: path.join(__dirname, './src/headers_NCCL.json'),
            pretty: true
        })
    ],
    devtool: false
};