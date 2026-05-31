/**
 * templatize settings
 * --------------------
 * The reverse of `copy-template-dir`: turns a *working* plugin into template
 * source by replacing concrete values with the `{{placeholder}}` tokens used
 * under templates/. Run it with `npm run templatize -- --src <path-to-plugin>`.
 *
 * HOW TO USE
 *   1. Edit each `value` below so it matches the EXACT string used in your
 *      working source plugin (the example values assume a plugin literally
 *      named "Acme Awesome"). Leave `placeholder` alone — those match the
 *      tokens the generator already expects.
 *   2. To parameterize something new, just add another `{ value, placeholder }`
 *      line. That is all "adding a literal" takes.
 *
 * THINGS THE SCRIPT DOES FOR YOU (so this file stays simple)
 *   - Replaces longest values first, so short values (e.g. the prefix `acme`)
 *     never corrupt longer ones (e.g. `Acme_Awesome`). Order here doesn't matter.
 *   - Renames files/folders too (e.g. `acme-awesome.php` -> `{{pluginFileName}}.php`).
 *   - Warns about literals that matched nothing, values left behind, and two
 *     literals sharing the same `value` (an unavoidable ambiguity in WP plugins
 *     where, e.g., textDomain and pluginFileName are often the identical string —
 *     the script picks one and tells you which spots to eyeball).
 *
 * Set a `value` to '' (empty) to skip that literal for this run.
 */
module.exports = {
	// Public repo the GENERATOR pulls the working boilerplate plugin from at
	// generation time (downloaded with degit, then templatized on the fly and
	// cached locally — see utils/fetchTemplate.js). The repo must contain the
	// EXACT literal `value`s listed below, or the tokens won't be injected.
	//   repo  — a degit spec: 'owner/repo', 'github:owner/repo',
	//           'gitlab:owner/repo', 'bitbucket:owner/repo', or a full https URL.
	//   ref   — branch or tag to fetch.
	//   subdir— optional path WITHIN the repo to use as the plugin root.
	// Override at runtime with --repo / --ref, force a re-download with --refresh.
	source: {
		repo: 'provineet/stacker-plugin-boilerplate', // <-- set to the real boilerplate repo
		ref: 'main',
		subdir: ''
	},

	// Where the CLI templatizer (`npm run templatize -- --src <plugin>`) writes its
	// output for local review. Override with --dest. Not used by the generator.
	dest: './templates/fresh',

	// Names/paths skipped entirely when copying & scanning. Matched like
	// excludeFromConversion, with one addition — a leading '/' ANCHORS to the
	// plugin root:
	//   - bare name (no slash)    -> matches that name ANYWHERE (e.g. every
	//                                 nested node_modules / .git)
	//   - '/name' or '/a/b'       -> matches ONLY at the plugin root (and its
	//                                 subtree), so '/assets' ignores the root
	//                                 build dir but KEEPS src/assets
	//   - 'a/b' (slash, no '/')   -> exact relative path or its subtree
	ignore: [
		'node_modules',
		'.git',
		'vendor',
		'build',
		'dist',
		'dev-dist',
		'/assets', // root build output only — src/assets is kept
		'/blocks', // root build output only — src/blocks is kept
		'.DS_Store',
		'.agents',
		'.claude',
		'CLAUDE.md',
		'wordpress',
		'todo',
		'package-lock.json',
		'yarn.lock',
		'composer.lock',
		'skills-lock.json'
	],

	// Files COPIED VERBATIM — copied into the output untouched, but skipped from
	// literal replacement AND renaming. Use this for files that legitimately
	// contain one of your literal values you DON'T want tokenized (a license, a
	// changelog, vendored code, fixtures, a .pot file, etc.).
	//
	// Each entry is matched as either:
	//   - a bare name (no slash)  -> matches ANY file with that basename, anywhere
	//                                 e.g. 'LICENSE', 'readme.txt'
	//   - a relative path (slash) -> matches that exact path from the plugin root,
	//                                 OR everything under it if it's a folder
	//                                 e.g. 'src/data/seed.php', 'languages'
	excludeFromConversion: [
		'LICENSE',
		'readme.txt',
		'readme.md',
		'docker-configs/**'
	],

	// value (in your working plugin)  ->  placeholder (token in templates/)
	literals: [
		// --- identity (edit these to match your source plugin) ---
		{ value: 'Stacker Boilerplate Plugin', placeholder: '{{name}}' },
		{ value: 'stacker-wordpress-plugin-boilerplate', placeholder: '{{pluginFileName}}' },
		{ value: 'stacker-plugin-boilerplate', placeholder: '{{textDomain}}' }, // kept DISTINCT from pluginFileName so each maps unambiguously — use this exact (different) string for the text domain in your source plugin
		{ value: 'stacker_plugin', placeholder: '{{prefix}}' },
		{ value: 'STACKER_PLUGIN', placeholder: '{{constantPrefix}}' },
		{ value: 'namespace STACKER_PLUGIN', placeholder: 'namespace {{namespace}}' }, // often same as constantPrefix
		{ value: 'Stacker Main', placeholder: '{{packageName}}' },
		{ value: 'Stacker Settings', placeholder: '{{name}} Settings' },

		// --- composer / blocks ---
		{ value: 'Vineet Verma', placeholder: '{{authorName}}' },
		{ value: 'stacker-block', placeholder: '{{blockNamespace}}' },
		{ value: 'stacker-boilerplate-category', placeholder: '{{blockCategory}}' },

		// --- author & urls ---
		{ value: 'Vineet', placeholder: '{{authorName}}' },
		{ value: 'vineet@blogohblog.com', placeholder: '{{authorEmail}}' },
		{ value: 'https://blogohblog.com/stacker-boilerplate-plugin', placeholder: '{{pluginUrl}}' },
		{ value: 'https://blogohblog.com', placeholder: '{{authorUrl}}' },
		
		// --- meta ---
		{ value: 'A modern WordPress Plugin Development boilerplate for your next awesome project.', placeholder: '{{description}}' },
		{ value: 'GPL-2.0-or-later', placeholder: '{{license}}' },
		{ value: '1.0.0', placeholder: '{{version}}' },
		{ value: 'localhost:10008', placeholder: '{{proxy}}' },
		{ value: '10008:80', placeholder: '{{wp_port}}:80' },

		// --- requirements (only if your source pins these exact strings) ---
		// { value: '6.0', placeholder: '{{reqWP}}' }, // e.g. '5.3'
		// { value: '8.1', placeholder: '{{reqPHP}}' }, // e.g. '7.2'

		// --- generate-time computed tokens ---
		// These are NOT stable strings in a normal working plugin; the generator
		// derives them (see utils/generate.js). Leave empty and wire them in by
		// hand if/where you need them in the template.
		{ value: '2026', placeholder: '{{year}}' },
		{ value: '', placeholder: '{{packageBuildCommand}}' },
		{ value: '', placeholder: '{{pluginSupports}}' },
		{ value: '', placeholder: '{{assetsFolder}}' }
	]
};
