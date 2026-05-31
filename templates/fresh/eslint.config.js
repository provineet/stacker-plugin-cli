/**
 * ESLint flat config (ESLint 9+/v10).
 *
 * Builds on the default config shipped with @wordpress/scripts and adds the
 * directories that should never be linted (downloaded WordPress core, Composer
 * vendor, and build output).
 */
const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	{
		ignores: [
			'wordpress/**',
			'vendor/**',
			'node_modules/**',
			'blocks/**',
			'assets/**',
			'dist/**',
			'dev-dist/**',
			'.claude/**',
		],
	},
	...defaultConfig,
];
