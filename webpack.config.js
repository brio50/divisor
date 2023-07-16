module.exports = {
    entry: {
        main: __dirname + '/static/js/index.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                loader: 'file-loader',

                options: {
                    name: '[name].[ext]',
                    outputPath: __dirname + '/static/dist',
                },
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    output: {
        path: __dirname + '/static/dist',
        filename: 'bundle.js',
    }
}