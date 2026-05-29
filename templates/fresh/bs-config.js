/**
 * BrowserSync configuration.
 *
 * Proxies your local WordPress site and reloads the browser when the compiled
 * output (blocks/, assets/) or any PHP file changes. It is launched alongside
 * the wp-scripts watchers by `npm start`, or on its own with `npm run watch:sync`.
 *
 * IMPORTANT: set `proxy` to your local site's URL. For Local (by Flywheel) this
 * is usually the site domain (e.g. "stacker-plugin-cli.local") or the
 * "localhost:<port>" shown in the site's dashboard.
 */
module.exports = {
	proxy: '{{proxy}}',
	notify: true,
	open: false,
	ui: false,
	ghostMode: false,
	// Don't inject the live-reload snippet into wp-admin: it breaks the block
	// editor. Admin pages still load through the proxy, just without auto-reload
	// (use the front end for live reload; wp-scripts rebuilds blocks on save).
	snippetOptions: {
		blacklist: [ '/wp-admin/**' ],
	},
	files: [ 'blocks/**/*', 'assets/**/*', '**/*.php' ],
	watchOptions: {
		ignored: [ 'node_modules/**', 'vendor/**', 'wordpress/**' ],
	},
};
