const { SUPPORTS } = require( './gulpfile.config' );
const { pluginStyles, blocksEditorStyles, blocksStyles } = require( './scss' );
const { copyassets } = require( './copyassets' );
const { watch } = require( './watch' );
const { build } = require( './createdist' );
const { phpsniff } = require( './phpsniffer' );
const { parallel } = require( 'gulp' );

let scss = pluginStyles;
// process blocks assets only if support is enabled.
if ( SUPPORTS.includes( 'blocks' ) ) {
	scss = parallel( pluginStyles, blocksEditorStyles, blocksStyles );
}

module.exports = {
	scss,
	copyassets,
	watch,
	build,
	phpsniff,
};
