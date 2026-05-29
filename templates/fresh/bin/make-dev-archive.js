#!/usr/bin/env node
/**
 * Builds a source-inclusive development archive in dev-dist/<plugin>.zip.
 *
 * This is the replacement for the old `gulp build --dev` task: it zips the
 * full working copy (source + any compiled output) minus dependencies and
 * build artifacts, wrapped in a folder named after the plugin directory.
 *
 * Run with `npm run devdist`.
 */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require( 'fs' );
const path = require( 'path' );
const { sync: glob } = require( 'glob' );
const AdmZip = require( 'adm-zip' );

const root = path.resolve( __dirname, '..' );
const pluginName = path.basename( root );
const outDir = path.join( root, 'dev-dist' );
const outFile = path.join( outDir, `${ pluginName }.zip` );

// Everything except dependencies, build artifacts and VCS/editor metadata.
const files = glob( '**/*', {
	cwd: root,
	dot: true,
	nodir: true,
	ignore: [
		'node_modules/**',
		'vendor/**',
		'dist/**',
		'dev-dist/**',
		'wordpress/**',
		'.git/**',
		'.claude/**',
		'**/*.zip',
	],
} );

const zip = new AdmZip();
files.forEach( ( rel ) => {
	const dir = path.posix.dirname( rel );
	const zipFolder = dir === '.' ? pluginName : `${ pluginName }/${ dir }`;
	zip.addLocalFile( path.join( root, rel ), zipFolder );
} );

fs.mkdirSync( outDir, { recursive: true } );
zip.writeZip( outFile );

process.stdout.write(
	`Created ${ path.relative( root, outFile ) } (${ files.length } files).\n`
);
