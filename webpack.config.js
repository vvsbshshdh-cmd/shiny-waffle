const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // added

module.exports = {
    mode: 'development',
    entry: {
        background: './src/background/background.ts',
        // use the exact name the extension expects: content-script.js
        'content-script': './src/content/contentScript.ts',
        popup: './src/popup/popup.tsx',
        panel: './src/panel/panel.tsx',
    },
    output: {
        // produce filenames that match manifest entries (background.js, content-script.js, popup.js, panel.js)
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/popup/popup.html',
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new HtmlWebpackPlugin({
            template: './src/panel/panel.html',
            filename: 'panel.html',
            chunks: ['panel'],
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'manifest.json', to: '.' },
                // copy any static assets you need in extension root
                { from: 'src/popup/popup.html', to: 'popup.html' },
                { from: 'src/panel/panel.html', to: 'panel.html' }
            ],
        }),
    ],
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
    },
};