const fs = require('fs');
const path = require('path');

/**
 * copydir — the template-aware recursive copy used by the generator.
 *
 * This replaces `copy-template-dir` (and its `maxstache` engine), which split
 * file contents on `{{` AND `}}` as interchangeable delimiters and assumed they
 * strictly alternated. Any standalone `}}` (a JSX arrow-function close), a JSX
 * double-brace expression (`{{ placement: 'x' }}`), or a GitHub Actions token
 * (`${{ matrix.php }}`) flipped that parity and silently corrupted or truncated
 * everything after it — which is exactly what mangled the generated
 * settings.js.
 *
 * Here a placeholder is ONLY `{{token}}`: double braces around a bare
 * identifier (letters, digits, underscore) with no inner whitespace. Real
 * JS/JSX/YAML braces never match, so they pass through untouched. Unknown
 * tokens are left verbatim rather than blanked out, and binary files are copied
 * byte-for-byte.
 */

// {{token}} — bare identifier only, no inner whitespace.
const TOKEN = /\{\{(\w+)\}\}/g;

const applyTokens = (str, vars) =>
	str.replace(TOKEN, (match, name) =>
		Object.prototype.hasOwnProperty.call(vars, name)
			? String(vars[name])
			: match
	);

// Strip a single leading underscore from the final path segment, matching
// copy-template-dir's removeUnderscore (e.g. `_gitignore` -> `gitignore`).
const removeLeadingUnderscore = relPath => {
	const parts = relPath.split(path.sep);
	const name = parts.pop().replace(/^_/, '');
	return parts.concat(name).join(path.sep);
};

// A NUL byte is a reliable "this is not text" signal; copy such files verbatim.
const isBinary = buf => buf.includes(0);

// Collect every file (recursively) as a path relative to `base`.
const listFiles = (dir, base = dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory()
			? listFiles(full, base)
			: [path.relative(base, full)];
	});

/**
 * Copy `srcDir` into `outDir`, expanding `{{token}}` placeholders in both file
 * contents and file/dir names using `vars`. Returns the list of created paths.
 */
const copyTemplateDir = async (srcDir, outDir, vars = {}) => {
	const created = [];

	for (const rel of listFiles(srcDir)) {
		const destRel = applyTokens(removeLeadingUnderscore(rel), vars);
		const destPath = path.join(outDir, destRel);
		const srcPath = path.join(srcDir, rel);

		fs.mkdirSync(path.dirname(destPath), { recursive: true });

		const buf = fs.readFileSync(srcPath);
		fs.writeFileSync(
			destPath,
			isBinary(buf) ? buf : applyTokens(buf.toString('utf8'), vars)
		);
		// Preserve the source mode so executable files (e.g. git hooks) stay so.
		fs.chmodSync(destPath, fs.statSync(srcPath).mode);

		created.push(destPath);
	}

	return created;
};

module.exports = copyTemplateDir;
