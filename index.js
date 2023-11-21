#!/usr/bin/env node

/**
 * Stacker Plugin Boilerplate
 * A zero configuration dev-toolkit for WordPress Plugin Developers.
 *
 * @author vineetverma <www.blogohblog.com>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const inputs = require('./utils/inputs');
const generate = require('./utils/generate');
const pluginDeps = require('./utils/plugindeps');
const handleError = require('cli-handle-error');
const to = require('await-to-js').default;

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const stackerPlugin = async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	// take user inputs
	const response = await inputs();

	if (response === 'Restart') {
		await stackerPlugin();
		return;
	}

	// generate files
	const [err, pluginDir] = await to(generate(response));

	handleError('INPUT', err);

	// installing NPM dependencies for our plugin
	pluginDeps(pluginDir);

	debug && log(flags);
};

stackerPlugin();
