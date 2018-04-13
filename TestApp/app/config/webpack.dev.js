var webpack = require("webpack");
var webpackMerge = require("webpack-merge");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var commonConfig = require("./webpack.common.js");
var helpers = require("./helpers");
const ENV = process.env.NODE_ENV = process.env.ENV = "development";

module.exports = webpackMerge(commonConfig,
    {
        devtool: "cheap-module-eval-source-map",

        output: {
            path: helpers.root("../../../Publish_Code/TestApp"),
            publicPath: "/",
            filename: "[name].js",
            chunkFilename: "[id].chunk.js"
        },

        plugins: [
            new ExtractTextPlugin("[name].css"),
            new webpack.DefinePlugin({
                'process.env': {
                    'ENV': JSON.stringify(ENV),
                    'API_URL': JSON.stringify("http://localhost/TestApp/api")
                }
            })
        ],

        devServer: {
            historyApiFallback: true,
            stats: "minimal",
            contentBase: "app/",
            host: "localhost",
            port: 9000
        }
    });