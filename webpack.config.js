const path = require('path');
const src = __dirname + "/src";

var webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    context: src,
    entry: './js/index.js',

    mode: 'development',

    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "main.js"
    },

    devServer: {
        contentBase: 'dist',
        open: true
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude:/node_modules/,
                loader: "babel-loader",
                query: {
                    presets:[
                        ["env", {
                            "targets": {
                                "node": "current"
                            }
                        }]
                    ]
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ]
    },

    plugins: [
        new UglifyJSPlugin(),
        new HtmlWebpackPlugin({
            template: "./html/index.html"
        })
    ]

};