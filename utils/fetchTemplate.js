const fs = require('fs');
const os = require('os');
const path = require('path');
const degit = require('degit');
const { yellow: y, dim: d } = require('chalk');

const { templatizeDir } = require('./templatize');

/**
 * fetchTemplate — download → templatize → cache.
 *
 * The generator no longer ships a bundled `templates/fresh`. Instead it pulls the
 * working boilerplate plugin from the public repo named in `templatize.config.js`
 * (`source`), runs the templatize conversion on it (literals -> `{{placeholder}}`),
 * and caches that result. The returned path is a ready-to-copy templated source —
 * exactly what `utils/copydir.js` expects.
 *
 *   first run     -> download (degit) + templatize into the cache, return it
 *   within 24h    -> reuse the cache (instant, no network)
 *   after 24h     -> try to re-download; if offline, fall back to the stale cache
 *   `--refresh`   -> always re-download, ignoring the cache age
 *   download fail -> fall back to a populated cache if one exists, else a clear error
 */

// How long a cached templatized copy is considered fresh before we try to
// re-download. Past this, a successful fetch refreshes it; an offline fetch
// keeps using the stale copy. Override per-run with `--refresh`.
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Build a degit spec ('owner/repo#ref/subdir' style) from config + flag overrides.
const buildSpec = (source = {}, repoFlag, refFlag) => {
	const repo = repoFlag || source.repo;
	if (!repo) {
		throw new Error(
			'No template source configured. Set `source.repo` in templatize.config.js or pass --repo.'
		);
	}
	const ref = refFlag || source.ref;
	const subdir = source.subdir;

	// degit grammar: <repo>[/subdir][#ref]. A flag-provided repo may already carry
	// its own #ref/subdir, so only append the config parts when not already present.
	let spec = String(repo);
	if (subdir && !spec.includes('/' + subdir) && !spec.includes('#')) {
		spec += '/' + String(subdir).replace(/^\/+/, '');
	}
	if (ref && !spec.includes('#')) spec += '#' + ref;
	return spec;
};

// Persistent cache root for templatized output (honours XDG on Linux).
const cacheRoot = () =>
	path.join(process.env.XDG_CACHE_HOME || path.join(os.homedir(), '.cache'), 'stacker', 'templates');

// One stable folder per spec. Slashes/#/etc. -> '-' so it's a safe dir name.
const cacheKey = spec => spec.replace(/[^a-zA-Z0-9._-]+/g, '-');

const isPopulated = dir => {
	try {
		return fs.statSync(dir).isDirectory() && fs.readdirSync(dir).length > 0;
	} catch {
		return false;
	}
};

// Freshness is tracked in a sibling `<key>.meta.json` (NOT inside the cache dir,
// so it never gets copied into the generated plugin).
const metaPath = key => path.join(cacheRoot(), `${key}.meta.json`);

const fetchedAt = key => {
	try {
		return JSON.parse(fs.readFileSync(metaPath(key), 'utf8')).fetchedAt || 0;
	} catch {
		return 0;
	}
};

const stampFetched = key => {
	try {
		fs.mkdirSync(cacheRoot(), { recursive: true });
		fs.writeFileSync(metaPath(key), JSON.stringify({ fetchedAt: Date.now() }));
	} catch {
		/* a missing timestamp just means the next run re-downloads — non-fatal */
	}
};

const fetchTemplate = async (config, { repo, ref, refresh } = {}) => {
	const spec = buildSpec(config.source, repo, ref);
	const key = cacheKey(spec);
	const cachePath = path.join(cacheRoot(), key);
	const cached = isPopulated(cachePath);

	// Fresh-cache fast path: reuse if populated, within TTL, and not forced.
	if (!refresh && cached && Date.now() - fetchedAt(key) < TTL_MS) {
		return cachePath;
	}

	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stacker-'));
	try {
		// degit downloads the repo tarball (no .git, no `git` binary needed).
		await degit(spec, { force: true, cache: false, verbose: false }).clone(tmp);

		// Convert the working plugin into templated source, into the cache.
		templatizeDir(tmp, cachePath, config);
		stampFetched(key);
		return cachePath;
	} catch (err) {
		// Network/host failure: limp along on a previously cached copy if we have one.
		if (isPopulated(cachePath)) {
			console.log(
				`\n${y('⚠ Could not refresh the template')} ${d(`(${err.message})`)} — using the cached copy.`
			);
			return cachePath;
		}
		throw new Error(
			`Couldn't download the template from "${spec}". ` +
				`Check your connection (and that the repo is public), then try again.\n${err.message}`
		);
	} finally {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
};

module.exports = fetchTemplate;
