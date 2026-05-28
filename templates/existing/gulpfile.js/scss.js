/* eslint-disable import/no-extraneous-dependencies */
const { PATHS } = require( './gulpfile.config' );

const autoprefixer = require( 'autoprefixer' ),
	mqpacker = require( 'css-mqpacker' ),
	cssnano = require( 'cssnano' ),
	gulp = require( 'gulp' ),
	sass = require( 'gulp-sass' )( require( 'sass' ) ),
	postcss = require( 'gulp-postcss' ),
	concat = require( 'gulp-concat' ),
	path = require( 'path' );

const postCSSOptions = [
	autoprefixer(),
	mqpacker(), // Combine media query rules.
	cssnano(), // Minify.
];

const sassOptions = {
	includePaths: [
		path.resolve( __dirname, './src/' ),
		path.resolve( __dirname, './src/assets/scss' ),
		'./node_modules',
	],
};

// styles for our plugin. (styles used out of blocks)
function pluginStyles() {
	return gulp
		.src( [ PATHS.scss + '/**/*.scss', `!${ PATHS.scss }/**/_*.scss` ] )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( gulp.dest( PATHS.outputcss ) );
}

// block editor only styles
function blocksEditorStyles() {
	return gulp
		.src( [ PATHS.blocks + '/**/editor.scss' ] )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'editor_blocks.css' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( gulp.dest( PATHS.outputcss ) );
}

// block frontend styles (used by both editor and frontend)
function blocksStyles() {
	return gulp
		.src( [ PATHS.blocks + '/**/style.scss' ] )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'frontend_blocks.css' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( gulp.dest( PATHS.outputcss ) );
}

exports.scss = gulp.parallel( pluginStyles, blocksEditorStyles, blocksStyles );
exports.pluginStyles = pluginStyles;
exports.blocksEditorStyles = blocksEditorStyles;
exports.blocksStyles = blocksStyles;
