module.exports = {
    entry: {
        main: __dirname + '/static/js/index.js',
    },
    output: {
        path: __dirname + '/static/dist',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
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
                test: /\.md$/,
                use: ['raw-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
}