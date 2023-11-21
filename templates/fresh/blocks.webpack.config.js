/**
 * WP Scripts default webpack.config.js
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
/**
 * Internal dependencies
 */
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils' );

const entryPoints = getWebpackEntryPoints();

module.exports = {
	...defaultConfig,
	entry: {
		...entryPoints,
		// entry point for our plugin's common admin.js file
		admin: {
			import: './src/assets/js/admin.js',
			filename: '../assets/js/admin.js',
		},
		// entry point for our plugin's common public.js file
		public: {
			import: './src/assets/js/public.js',
			filename: '../assets/js/public.js',
		},
	},
};
