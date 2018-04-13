var webpack = require("webpack");
var webpackMerge = require("webpack-merge");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var commonConfig = require("./webpack.common.js");
var helpers = require("./helpers");
var copywebpackPlugin = require("copy-webpack-plugin");
var ChunkRenamePlugin = require("chunk-rename-webpack-plugin");
var CompressionPlugin = require("compression-webpack-plugin");
const ENV = process.env.NODE_ENV = process.env.ENV = "production";

module.exports = webpackMerge(commonConfig,
    {
        devtool: "source-map",

        output: {
            path: helpers.root("../../../Publish_Code/TestApp"),
            publicPath: "/",
            filename: "[name].[hash].js",
            chunkFilename: "[id].[hash].chunk.js"
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
                mangle: {
                    keep_fnames: true
                },
                compress: {
                    warnings: false, // Suppress uglification warnings
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    screw_ie8: true
                },
                output: {
                    comments: false,
                },
                exclude: [/\.min\.js$/gi] // skip pre-minified libs
            }),
            new ExtractTextPlugin("[name].[hash].css"),
            new webpack.DefinePlugin({
                'process.env': {
                    'ENV': JSON.stringify(ENV),
                    'API_URL': JSON.stringify("/api")
                }
            }),
            new webpack.LoaderOptionsPlugin({
                htmlLoader: {
                    minimize: false // workaround for ng2
                }
            }),
            new CompressionPlugin({
                asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    });