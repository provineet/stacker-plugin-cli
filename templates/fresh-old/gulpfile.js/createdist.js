const {
	PATHS,
	distIgnore, // Files to be ignored while building the dist folder
	devDistIgnore, // Files to be ignored while building the devdist folder
} = require( './gulpfile.config' );

const { src, dest, series } = require( 'gulp' );
const { rimraf } = require( 'rimraf' );
const nodePath = require( 'path' );
const zip = require( 'gulp-zip' );

// remove the dist folder
function cleandist( done ) {
	rimraf.sync( [ PATHS.dist ] );
	done();
}

// remove the dev-dist folder
function cleandevdist( done ) {
	rimraf.sync( [ PATHS.devdist ] );
	done();
}

// Create a dist folder
function createDist( distFolder, ignoreFiles ) {
	const pluginName = nodePath
		.resolve( __dirname, '..' )
		.split( nodePath.sep )
		.pop();
	return src( [ '**/*', '*' ], {
		ignore: ignoreFiles,
		buffer: true,
		dot: true,
	} )
		.pipe( dest( `${ distFolder }/${ pluginName }` ) )
		.pipe( zip( `${ pluginName }.zip` ) )
		.pipe( dest( distFolder ) );
}

// Create a distributable version of plugin.
function dist() {
	if ( process.argv[ 3 ] === '--dev' ) {
		return createDist( PATHS.devdist, devDistIgnore );
	}
	return createDist( PATHS.dist, distIgnore );
}

exports.build = series( cleandist, cleandevdist, dist );
