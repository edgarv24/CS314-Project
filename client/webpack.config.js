const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MODULE_RULES = {
	rules:
		[
			{ test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.css$/i, use: ['style-loader', 'css-loader'] },
			{
				test: /\.s[ac]ss$/i, use:
					[
						{ loader: 'style-loader' },
						{ loader: 'css-loader' },
						{ loader: 'postcss-loader', options:
								{
									plugins: function()
									{
										return [require('precss'), require('autoprefixer')];
									}
								}
						},
						{ loader: 'sass-loader' }
					]
			},
			{ test: /\.(png|svg|jpg|gif)$/, use: ['file-loader'] }
		]
};


module.exports = env => {

	let CLIENT_PORT;
	let SERVER_PORT;

	if (env)
	{
		CLIENT_PORT = env.CLIENT_PORT;
		SERVER_PORT = env.SERVER_PORT;
	}

	return {
		entry: ['@babel/polyfill', './src/entry.js'],
		devServer: { hot: true, open: true, port: CLIENT_PORT },
		module: MODULE_RULES,
		output: { filename: "bundle.js", path: path.join(__dirname, './dist/public/') },
		performance: { hints: false },
		plugins: [
			new CleanWebpackPlugin(),
			new webpack.DefinePlugin({'process.env.SERVER_PORT': SERVER_PORT}),
			new HtmlWebpackPlugin({ template: 'templates/index.html', favicon: "templates/favicon.ico" }),
			new webpack.HotModuleReplacementPlugin()
		]
	}
};