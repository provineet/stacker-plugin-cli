/**
 * Webpack config for plugin-level (non-block) assets.
 *
 * Blocks are built separately with the default @wordpress/scripts pipeline
 * (`wp-scripts build --webpack-src-dir=./src/blocks --output-path=./blocks`),
 * which emits each block's JS plus its per-block index.css / style-index.css.
 *
 * This config builds the standalone scripts in src/assets/js/*.js (each may
 * import its own SCSS) into assets/js + assets/css, and copies images from
 * src/assets/img into assets/img.
 */
/* eslint-disable import/no-extraneous-dependencies */
const glob = require( 'glob' );
const path = require( 'path' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

// One entry per src/assets/js/*.js. Files prefixed with "_" are partials.
const entry = {};
glob.sync( path.join( __dirname, 'src/assets/js/*.js' ), {
	ignore: [ path.join( __dirname, 'src/assets/js/_*.js' ) ],
} ).forEach( ( file ) => {
	entry[ path.basename( file, '.js' ) ] = file;
} );

// Extract imported SCSS into assets/css instead of the output root.
defaultConfig.plugins.forEach( ( plugin ) => {
	if (
		plugin.constructor &&
		plugin.constructor.name === 'MiniCssExtractPlugin'
	) {
		plugin.options.filename = 'css/[name].css';
	}
} );

// Drop the block-oriented plugins inherited from the default config:
//   - CopyPlugin copies block.json (only relevant to the blocks build)
//   - RtlCssPlugin generates -rtl stylesheets (kept for blocks, not needed here)
const plugins = defaultConfig.plugins.filter(
	( plugin ) =>
		! [ 'CopyPlugin', 'RtlCssPlugin' ].includes(
			plugin.constructor && plugin.constructor.name
		)
);

module.exports = {
	...defaultConfig,
	entry,
	output: {
		...defaultConfig.output,
		path: path.join( __dirname, 'assets' ),
		filename: 'js/[name].js',
	},
	plugins: [
		...plugins,
		new CopyWebpackPlugin( {
			patterns: [
				{
					from: path.join( __dirname, 'src/assets/img' ),
					to: path.join( __dirname, 'assets/img' ),
					noErrorOnMissing: true,
				},
			],
		} ),
	],
};
