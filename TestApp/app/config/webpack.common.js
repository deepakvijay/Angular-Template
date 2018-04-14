var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var helpers = require("./helpers");
const { AngularCompilerPlugin } = require('@ngtools/webpack');
module.exports = {
    entry: {
        'polyfills': "./polyfills.ts",
        'vendor': "./vendor.ts",
        'app': "./app/main.ts"
    },

    resolve: {
        extensions: [".ts", ".js"]
    },

    module: {
        exprContextCritical: false,
        rules: [
            {
                "test": /\.ts$/,
                "loader": "@ngtools/webpack"
            },
            // {
            // test: /\.ts$/,
            // loaders: ["awesome-typescript-loader", "angular2-template-loader", "angular-router-loader"]
            // },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.(png|jpe?g|gif|ico)$/,
                loader: "file-loader?name=assets/img/[name].[hash].[ext]"
            },
            {
                test: /\.css$/,
                exclude: helpers.root("app"),
                loader: [ExtractTextPlugin.extract({ fallbackLoader: "style-loader", loader: "css-loader?sourceMap" }), 'to-string-loader', 'css-loader']
            },
            {
                test: /\.css$/,
                include: helpers.root("app"),
                loader: "raw-loader"
            }
        ]
    },
    plugins: [
        // Workaround for angular/angular#11580
        new webpack.ContextReplacementPlugin(
            // The (\\|\/) piece accounts for path separators in *nix and Windows
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root("./app"), // location of your src
            {} // a map of your routes
        ),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
       
        new webpack.optimize.CommonsChunkPlugin({
            name: ["app", "vendor", "polyfills"]
        }),
        new HtmlWebpackPlugin({
            template: "./app/index.html"
        }),
        new AngularCompilerPlugin({
            "mainPath": "./app/main.ts",
            "platform": 0,
            "sourceMap": true,
            "tsConfigPath": "./tsconfig.json",
            "skipCodeGeneration": true,
            "preserveWhitespaces": false,
            "fullTemplateTypeCheck": true,
            "compilerOptions": {}
        })
    ]
};
