const glob = require( 'glob' );
const path = require( 'path' );
/**
 * WP Scripts default webpack.config.js
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
/**
 * Internal dependencies
 */
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils' );

const assetsFiles = {};

glob.sync( __dirname + '/src/assets/js/*.js', {
	ignore: [ 'node_modules/**', __dirname + '/src/assets/js/_*.js' ],
} ).forEach( ( file ) => {
	const fileName = path.basename( file );
	assetsFiles[ fileName ] = {
		import: file,
		filename: {assetsFolder} + fileName,
	};
} );

const entryPoints = getWebpackEntryPoints();

module.exports = {
	...defaultConfig,
	entry: {
		...entryPoints,
		...assetsFiles,
	},
};
