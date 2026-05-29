const { PATHS, watchFiles, SUPPORTS } = require( './gulpfile.config' );

const { watch: gulpWatch, series } = require( 'gulp' );

const { browsersync, reloadBrowser } = require( './browsersync' );

const { pluginStyles, blocksEditorStyles, blocksStyles } = require( './scss' );
const { copyimg, copyfonts } = require( './copyassets' );
// const unhandledError = require("cli-handle-unhandled");

function watchSCSS() {
	// Watches for SCSS file changes
	if ( watchFiles.scss === true ) {
		// only watch blocks files if support is enabled.
		if ( SUPPORTS.includes( 'blocks' ) ) {
			gulpWatch(
				PATHS.blocks + '/**/style.scss',
				series( blocksStyles, reloadBrowser )
			);
			gulpWatch(
				PATHS.blocks + '/**/editor.scss',
				series( blocksEditorStyles, reloadBrowser )
			);
		}

		gulpWatch(
			PATHS.scss + '/**/*.scss',
			series( pluginStyles, reloadBrowser )
		);
	}
}

function watchImg() {
	// Watches for Images file changes inside ./src
	if ( watchFiles.images === true ) {
		gulpWatch( PATHS.images + '**/*', series( copyimg, reloadBrowser ) );
	}
}

function watchFonts() {
	// Watches for Images file changes inside ./src
	if ( watchFiles.fonts === true ) {
		gulpWatch( PATHS.fonts + '/*', series( copyfonts, reloadBrowser ) );
	}
}

function watchJs() {
	// Watches for Images file changes inside ./src
	if (watchFiles.js === true) {
		const watchPaths = [PATHS.outputjs + '/**/*.js'];
		if (SUPPORTS.includes('blocks')) {
			watchPaths.push(PATHS.blocks + '/**/*.js');
		}
		gulpWatch(
			watchPaths,
			series(reloadBrowser)
		);
	}
}

function watchPHP() {
	// Watches for PHP files changes
	if ( watchFiles.php === true ) {
		gulpWatch(
			'**/*.php',
			{ ignored: [ './node_modules/**/*.php' ] },
			series( reloadBrowser )
		);
	}
}

// Watches for changes in scss, images, fonts and all .php files
function watchAll() {
	browsersync();
	watchSCSS();
	watchJs();
	watchFonts();
	watchImg();
	watchPHP();
}

module.exports = { watchAll };
