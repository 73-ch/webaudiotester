module.exports = {
    entry: './src/index.js',

    mode: 'development',

    output: {
        filename: "main.js"
    },

    devServer: {
        contentBase: 'dist',
        open: true
    }

};