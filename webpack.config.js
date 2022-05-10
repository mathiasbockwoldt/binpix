const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
	return ({
		stats: 'minimal', // Keep console output easy to read.
		entry: './src/index.ts', // Your program entry point

		// Your build destination
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'bundle.js'
		},

		// Config for your testing server
		devServer: {
			compress: true,
			static: false,
			client: {
				logging: "warn",
				overlay: {
					errors: true,
					warnings: false,
				},
				progress: true,
			},
			port: 7788,
			host: '127.0.0.1'
		},

		// If we build, inform if the bundle is too big
		performance: {
			maxAssetSize: 500000,
            maxEntrypointSize: 500000,
			hints: argv.mode === 'production' ? 'warning' : false,
		},

		// Enable sourcemaps while debugging
		devtool: argv.mode === 'development' ? 'eval-source-map' : undefined,

		// Minify the code when making a final build
		optimization: {
			minimize: argv.mode === 'production',
			minimizer: [new TerserPlugin({
				terserOptions: {
					ecma: 6,
					compress: { drop_console: true },
					output: { comments: false, beautify: false },
				},
			})],
		},

		// Explain webpack how to do Typescript
		module: {
			rules: [
				{
					test: /\.ts(x)?$/,
					loader: 'ts-loader',
					exclude: /node_modules/
				}
			]
		},
		resolve: {
			extensions: [
				'.tsx',
				'.ts',
				'.js'
			]
		},

		plugins: [
			// Copy our static assets to the final build
			new CopyPlugin({
				patterns: [{ from: 'static/' }],
			}),

			// Make an index.html from the template
			new HtmlWebpackPlugin({
				template: 'src/index.ejs',
				hash: true,
				minify: false
			})
		]
	});
}
