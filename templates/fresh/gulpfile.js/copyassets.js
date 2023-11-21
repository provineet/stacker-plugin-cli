const { PATHS } = require( './gulpfile.config' );
const { src, dest, parallel } = require( 'gulp' );

// copy images to the assets/img folder
function copyImg() {
	return src( PATHS.images + '/**' ).pipe( dest( PATHS.outputimg ) );
}
// copy images to the assets/img folder
function copyFonts( cb ) {
	// return src( PATHS.fonts + '/**' ).pipe( dest( PATHS.outfonts ) );
	cb();
}

exports.copyassets = parallel( copyImg, copyFonts );
exports.copyimg = copyImg;
exports.copyfonts = copyFonts;
