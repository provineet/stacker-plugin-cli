const meow = require('meow');
const meowHelp = require('cli-meow-help');
const pkg = require('./../package.json');

const flags = {
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `string`,
		default: pkg.version,
		alias: `v`,
		desc: `Print CLI version`
	},
	output: {
		type: `string`,
		default: process.cwd(),
		alias: `o`,
		desc: `Output path for your WordPress plugin files.`
	},
	repo: {
		type: `string`,
		desc: `Template source repo (degit spec). Overrides templatize.config.js source.repo.`
	},
	ref: {
		type: `string`,
		desc: `Branch or tag of the template repo to use.`
	},
	refresh: {
		type: `boolean`,
		default: false,
		desc: `Force re-download of the template, ignoring the local cache.`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `stk`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
