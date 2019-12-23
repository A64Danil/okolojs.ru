const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const CopyWebpackPlugin= require('copy-webpack-plugin');

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false,
        })
    })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

module.exports = {
    entry: [
        './src/js/index.js',
        './src/scss/style.scss',
    ],
    // entry: {
    //     app: './src/js/index.js',
    //     adminApp: './src/js/admin.js',
    // },
    output: {
        filename: './js/bundle.js'
    },
    devtool: "source-map",
    module: {
        rules: [
            { test: /\.(png|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {name: 'img/[name].[ext]'}
                    }
                ]
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/env']
                    }
                }
            },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, 'src/scss'),
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            // {
            //     test: /\.handlebars$/,
            //     loader: "handlebars-loader"
            // },
            // {
            //     test: /\.html$/,
            //     include: path.resolve(__dirname, 'src/html/includes'),
            //     use: ['raw-loader']
            // },
            // {
            //     test: /\.html$/,
            //     include: path.resolve(__dirname, 'src/html/includes'),
            //     use: ['raw-loader']
            // },
            // {
            //     test: /\.html$/,
            //     use: [ {
            //         loader: 'html-loader',
            //         options: {
            //             minimize: true
            //         }
            //     }],
            // }


        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './css/style.bundle.css',
            allChunks: true,
        }),
        // new webpack.LoaderOptionsPlugin({
        //     options: {
        //         handlebarsLoader: {}
        //     }
        // }),
        // new HtmlWebpackPlugin({
        //     title: 'hbl_test.html',
        //     template: 'src/html/views/index.handlebars'
        // }),
        // new HtmlWebpackPlugin(), // Generates default index.html
        // new HtmlWebpackPlugin({  // Also generate a test.html
        //     filename: 'test_new.html',
        //     template: 'src/html/views/test.html'
        // }),
        new CopyWebpackPlugin([
            {
                from: './src/rootfolder',
                to: './'
            },
            {
                from: './src/fonts',
                to: './fonts'
            },
            {
                from: './src/favicon',
                to: './favicon'
            },
            {
                from: './src/img',
                to: './img'
            },
            {
                from: './src/uploads',
                to: './uploads'
            },
            {
                from: './src/model',
                to: './model'
            }
            ,
            {
                from: './src/core',
                to: './core'
            }
        ]),
    ].concat(htmlPlugins)
};