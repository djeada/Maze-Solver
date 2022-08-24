const path = require('path');

module.exports = {
    // where the typescript files are
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://localhost:3000/dist/'
    },
    devServer: {

        // tell where your index.html is located
        static: {
            directory: path.join(__dirname, '.')
        },

        // enable compression
        compress: true,

        // enable hot reloading
        hot: true,

        // listen on all interfaces
        host: '0.0.0.0',

        // listen on port 3000
        port: 3000,
    },
};