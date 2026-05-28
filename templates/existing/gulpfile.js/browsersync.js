const { browserSyncOptions } = require( './gulpfile.config' );

// eslint-disable-next-line import/no-extraneous-dependencies
const browserSync = require( 'browser-sync' ).create();

// Run: gulp browsersync
// Starts browser-sync task for starting the server.
function browsersync() {
	return browserSync.init( browserSyncOptions );
}

function reloadBrowser( done ) {
	browserSync.reload();
	done();
}

module.exports = { browsersync, reloadBrowser };
