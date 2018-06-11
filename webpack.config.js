const path = require('path');

module.exports = {
    entry: './src/index.js',

    mode: 'development',

    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "main.js"
    },

    devServer: {
        contentBase: 'dist',
        open: true
    }

};