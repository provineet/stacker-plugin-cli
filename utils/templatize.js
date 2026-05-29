#!/usr/bin/env node
/**
 * templatize — reverse of copy-template-dir.
 *
 * Reads a working plugin (--src), copies it to a destination (--dest, default
 * from templatize.config.js), then replaces concrete values with {{placeholder}}
 * tokens in both file CONTENTS and file/folder NAMES.
 *
 *   npm run templatize -- --src ../acme-awesome
 *   npm run templatize -- --src ../acme-awesome --dest templates/_new --dry
 *
 * The replacement map lives in templatize.config.js — add a literal there.
 */
const fs = require('fs');
const path = require('path');
const { replaceInFileSync } = require('replace-in-file');
const { green: g, dim: d, red: r, yellow: y, cyan: c, bold } = require('chalk');

const config = require('../templatize.config.js');

// --- args --------------------------------------------------------------
function parseArgs(argv) {
	const args = { src: null, dest: null, dry: false };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--src') args.src = argv[++i];
		else if (a.startsWith('--src=')) args.src = a.slice('--src='.length);
		else if (a === '--dest') args.dest = argv[++i];
		else if (a.startsWith('--dest=')) args.dest = a.slice('--dest='.length);
		else if (a === '--dry' || a === '--dry-run') args.dry = true;
		else if (a === '--help' || a === '-h') args.help = true;
	}
	return args;
}

function usage() {
	console.log(`
${bold('templatize')} — turn a working plugin into template source.

${bold('Usage')}
  npm run templatize -- --src <path> [--dest <path>] [--dry]

${bold('Flags')}
  --src   ${d('(required)')} path to the working plugin to read from
  --dest  output folder (default: ${c(config.dest)})
  --dry   preview matches/renames without writing anything

Edit ${c('templatize.config.js')} to change or add literals.
`);
}

const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// --- file walk ---------------------------------------------------------
const ignoreNames = new Set(config.ignore || []);

function walk(dir, files = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (ignoreNames.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walk(full, files);
		else if (entry.isFile()) files.push(full);
	}
	return files;
}

// Binary check: NUL byte in the head means "don't treat as text".
function isTextFile(file) {
	try {
		const fd = fs.openSync(file, 'r');
		const buf = Buffer.alloc(8000);
		const read = fs.readSync(fd, buf, 0, 8000, 0);
		fs.closeSync(fd);
		return !buf.subarray(0, read).includes(0);
	} catch {
		return false;
	}
}

function cpFilter(src) {
	return !ignoreNames.has(path.basename(src));
}

// Files to copy verbatim (skip both content replacement and renaming).
// Entries are exact paths / basenames (not full globs). Normalize away a
// leading './', a trailing slash, and a trailing '/**' or '/*' so a folder
// written either way ('docker-configs' or 'docker-configs/**') behaves the same.
const verbatimList = (config.excludeFromConversion || []).map(e =>
	e.replace(/^\.\//, '').replace(/\/\*\*?$/, '').replace(/\/+$/, '')
);

function isVerbatim(absPath, root) {
	if (!verbatimList.length) return false;
	const rel = path.relative(root, absPath).split(path.sep).join('/');
	const segments = rel.split('/');
	const base = path.basename(absPath);
	return verbatimList.some(e =>
		e.includes('/')
			? // a path: match it exactly, or anything beneath it (folder subtree)
			  rel === e || rel.startsWith(e + '/')
			: // a bare name: match a file by basename, or any folder by that name
			  base === e || segments.includes(e)
	);
}

// --- main --------------------------------------------------------------
function main() {
	const args = parseArgs(process.argv.slice(2));
	if (args.help) return usage();

	if (!args.src) {
		console.error(`\n${r('Missing --src.')} ${d('Pass the path to your working plugin.')}`);
		usage();
		process.exitCode = 1;
		return;
	}

	const src = path.resolve(args.src);
	if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) {
		console.error(`\n${r(`--src is not a directory:`)} ${src}`);
		process.exitCode = 1;
		return;
	}

	const dest = path.resolve(args.dest || config.dest);
	if (dest.startsWith(src + path.sep) || dest === src) {
		console.error(`\n${r('--dest must be outside --src')} to avoid copying into itself.`);
		process.exitCode = 1;
		return;
	}

	// Active literals: non-empty value, sorted longest-first to avoid collisions.
	const literals = (config.literals || [])
		.filter(l => l.value && l.value.length)
		.sort((a, b) => b.value.length - a.value.length);

	if (!literals.length) {
		console.error(`\n${r('No literals with a value set in templatize.config.js.')}`);
		process.exitCode = 1;
		return;
	}

	// Warn about duplicate values (ambiguous — first in sort order wins).
	const byValue = new Map();
	for (const l of literals) {
		if (!byValue.has(l.value)) byValue.set(l.value, []);
		byValue.get(l.value).push(l.placeholder);
	}
	const dupes = [...byValue.entries()].filter(([, ph]) => ph.length > 1);

	console.log(`\n${bold('templatize')} ${args.dry ? c('(dry run)') : ''}`);
	console.log(`${d('src ')} ${src}`);
	console.log(`${d('dest')} ${dest}\n`);

	// 1) copy (skip in dry run) -----------------------------------------
	if (!args.dry) {
		if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
		fs.cpSync(src, dest, { recursive: true, filter: cpFilter });
	}

	// Scan target (dest if copied, else read-only from src).
	const scanRoot = args.dry ? src : dest;
	const textFiles = walk(scanRoot).filter(isTextFile);

	// Split off files that are copied verbatim — still copied (cpSync already did
	// it), but excluded from counting, replacement, renaming and leftover checks.
	const verbatimFiles = textFiles.filter(f => isVerbatim(f, scanRoot));
	const convertFiles = textFiles.filter(f => !isVerbatim(f, scanRoot));

	// 2) pre-count occurrences per literal (drives "never matched") ------
	const counts = Object.fromEntries(literals.map(l => [l.placeholder, 0]));
	const contentCache = new Map();
	for (const file of convertFiles) {
		const content = fs.readFileSync(file, 'utf8');
		contentCache.set(file, content);
		for (const l of literals) {
			const m = content.match(new RegExp(escapeRegExp(l.value), 'g'));
			if (m) counts[l.placeholder] += m.length;
		}
	}

	// 3) replace file CONTENTS ------------------------------------------
	const from = literals.map(l => new RegExp(escapeRegExp(l.value), 'g'));
	const to = literals.map(l => l.placeholder);
	let contentChanged = 0;
	if (convertFiles.length) {
		const results = replaceInFileSync({
			files: convertFiles,
			from,
			to,
			dry: args.dry,
			countMatches: true
		});
		contentChanged = results.filter(res => res.hasChanged).length;
	}

	// 4) rename files & folders -----------------------------------------
	// Deepest-first so renaming a child never invalidates a parent's path.
	const renames = [];
	const allPaths = walkAll(scanRoot).sort((a, b) => b.length - a.length);
	for (const p of allPaths) {
		if (isVerbatim(p, scanRoot)) continue; // leave verbatim files/folders unrenamed
		const base = path.basename(p);
		let renamed = base;
		for (const l of literals) {
			if (renamed.includes(l.value)) {
				renamed = renamed.split(l.value).join(l.placeholder);
			}
		}
		if (renamed !== base) {
			const target = path.join(path.dirname(p), renamed);
			renames.push([p, target]);
			if (!args.dry) fs.renameSync(p, target);
		}
	}

	// 5) leftover scan (only meaningful on a real run) ------------------
	const leftovers = [];
	if (!args.dry) {
		for (const file of walk(dest).filter(isTextFile)) {
			if (isVerbatim(file, dest)) continue; // expected to still contain literals
			const content = fs.readFileSync(file, 'utf8');
			for (const l of literals) {
				if (content.includes(l.value)) {
					leftovers.push({ placeholder: l.placeholder, value: l.value, file: path.relative(dest, file) });
				}
			}
		}
	}

	// --- report --------------------------------------------------------
	console.log(bold('Literals'));
	for (const l of literals) {
		const n = counts[l.placeholder];
		const tag = n === 0 ? y('0 matches') : g(`${n}`);
		console.log(`  ${tag.padEnd(12)} ${d(l.value)} ${d('->')} ${l.placeholder}`);
	}

	const missed = literals.filter(l => counts[l.placeholder] === 0);
	if (missed.length) {
		console.log(`\n${y('⚠ never matched')} ${d('(value not found in source — check the value or drop the literal):')}`);
		missed.forEach(l => console.log(`  ${l.placeholder} ${d(`(looked for "${l.value}")`)}`));
	}

	if (dupes.length) {
		console.log(`\n${y('⚠ duplicate values')} ${d('(same string, multiple tokens — first wins, eyeball these spots):')}`);
		dupes.forEach(([val, ph]) => console.log(`  "${val}" -> ${ph.join(', ')}`));
	}

	if (renames.length) {
		console.log(`\n${bold('Renames')} ${args.dry ? d('(would rename)') : ''}`);
		renames.forEach(([fromP, toP]) =>
			console.log(`  ${d(path.relative(scanRoot, fromP))} ${d('->')} ${path.relative(scanRoot, toP)}`)
		);
	}

	if (leftovers.length) {
		console.log(`\n${y('⚠ values left behind')} ${d('(appeared again, e.g. inside a longer word — review manually):')}`);
		leftovers.slice(0, 30).forEach(lo => console.log(`  ${lo.file}: "${lo.value}" ${d(`(${lo.placeholder})`)}`));
		if (leftovers.length > 30) console.log(d(`  …and ${leftovers.length - 30} more`));
	}

	if (verbatimFiles.length) {
		console.log(`\n${bold('Copied verbatim')} ${d('(copied, not converted or renamed):')}`);
		verbatimFiles.forEach(f => console.log(`  ${path.relative(scanRoot, f)}`));
	}

	console.log();
	if (args.dry) {
		console.log(`${c('Dry run')} — nothing written. Re-run without ${c('--dry')} to apply.`);
	} else {
		console.log(`${g('Done.')} ${contentChanged} file(s) edited, ${renames.length} renamed, ${verbatimFiles.length} copied verbatim.`);
		console.log(`${d('Review')} ${dest} ${d('then copy it into templates/ as needed.')}`);
	}
}

// walk including directories (for renames)
function walkAll(dir, out = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (ignoreNames.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		out.push(full);
		if (entry.isDirectory()) walkAll(full, out);
	}
	return out;
}

main();
