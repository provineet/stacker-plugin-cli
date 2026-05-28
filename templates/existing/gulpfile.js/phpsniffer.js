const gulp = require( 'gulp' );
const phpcs = require( 'gulp-phpcs' );

// PHPCS sniffs using WordPress standards.
// Not using this task anymore as we're implementing it using composer run phpcs script
function phpsniff() {
	return (
		gulp
			.src( [
				'./**/*.php',
				'!./vendor/**/*.*',
				'!./wordpress/**/*.*',
				'!./node_modules/**/*.*',
			] )
			// Validate files using PHP Code Sniffer
			.pipe(
				phpcs( {
					bin: './vendor/bin/phpcs',
					standard: '.phpcs.xml.dist',
					warningSeverity: 1,
				} )
			)
			// Log all problems that was found
			.pipe( phpcs.reporter( 'fail' ) )
	);
}

exports.phpsniff = phpsniff;
