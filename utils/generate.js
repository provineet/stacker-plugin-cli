const fs = require('fs');
const ora = require('ora');
const path = require('path');
const { promisify } = require('util');
const copy = require('copy-template-dir');
const shouldCancel = require('cli-should-cancel');
const { green: g, dim: d, red: r, yellow: y } = require('chalk');
const { choice } = require('./ask');
const spinner = ora({ text: '' });

// copy-template-dir is callback-based; promisify so we can await each copy.
const copyDir = promisify(copy);

const setDirectories = async (userInputs, pluginFolder = null) => {
	const outDirName =
		pluginFolder == null
			? userInputs.pluginFileName
			: pluginFolder;
	let inDirPath = '',
		outDirPath = '';
	// version is available only in fresh installations
	if (userInputs.version) {
		outDirPath = path.join(process.cwd(), outDirName);
		inDirPath = path.join(__dirname, '../', 'templates/fresh');
	} else {
		outDirPath = process.cwd();
		inDirPath = path.join(__dirname, '../', 'templates/existing');
	}

	return [inDirPath, outDirPath, outDirName];
};

const confirmOverwrite = async message => {
	const proceed = await choice({
		name: 'question',
		message,
		choices: ['Overwrite', 'Cancel'],
		hint: `Use arrow key to change option type`
	});

	proceed === 'Cancel' && shouldCancel();
};

const checkFolder = async (userInputs, outDirPath, outDirName) => {
	// Existing-plugin integration: files are written into the current folder, so
	// it always exists. Warn only about the tooling files we'd overwrite.
	if (!userInputs.version) {
		const conflicts = ['package.json', 'composer.json'].filter(file =>
			fs.existsSync(path.join(outDirPath, file))
		);

		if (conflicts.length) {
			await confirmOverwrite(
				`${r(
					`\n\n${conflicts.join(' and ')} already exist in your plugin's folder. `
				)}\n${y(`Choose Overwrite to replace them | Cancel to bail out.`)}`
			);
		}

		return;
	}

	// Fresh install: the plugin lives in its own new subfolder.
	if (fs.existsSync(outDirPath)) {
		await confirmOverwrite(
			`${r(
				`\n\nPlugin \"${outDirName}\" already exists in your current folder.`
			)}\n${y(
				`Do you want to continue, it will overwrite the existing folder?`
			)}`
		);
	}
};

module.exports = async userInputs => {

	// Adds/Remove Gutenberg Blocks Support
	const packageBuildCommand = userInputs.blocks === 'No' ? 'js' : 'js:blocks';
	const pluginSupports = userInputs.blocks === 'Yes' ? `['blocks']` : '[]';
	const assetsFolder =  userInputs.blocks === 'Yes' ? `'../assets/js/' + ` : '';

	userInputs = {
		reqWP: '5.3',
		reqPHP: '7.2',
		year: new Date().getFullYear(),
		packageBuildCommand,
		pluginSupports,
		assetsFolder,
		...userInputs
	};

	// setting input/output directories path and name.
	const [inDirPath, outDirPath, outDirName] = await setDirectories(userInputs);

	// check if the plugin folder or files already exists in the current working directory.
	await checkFolder(userInputs, outDirPath, outDirName);

	console.log();
	spinner.start(`${y(`Generating your plugin files...\n`)}`);

	try {
		// copy the base template into the output directory.
		await copyDir(inDirPath, outDirPath, userInputs);

		// remove src/blocks if the plugin isn't going to register gutenberg blocks.
		if (userInputs.blocks === 'No') {
			fs.rmSync(path.join(outDirPath, 'src/blocks'), { recursive: true, force: true });

			// The block-free overlay rewrites the main plugin file and inc/admin
			// hooks, which only exist in fresh installs. Existing-plugin
			// integrations have neither, so we leave their PHP untouched.
			if (userInputs.version) {
				const inBlocks = path.join(__dirname, '../', 'templates/without-blocks');
				await copyDir(inBlocks, outDirPath, userInputs);
			}
		}

		// remove docker files if devEnv is LocalWP.
		if (userInputs.devEnv === 'LocalWP') {
			fs.rmSync(path.join(outDirPath, 'docker-configs'), { recursive: true, force: true });
			fs.rmSync(path.join(outDirPath, 'docker-compose.yaml'), { force: true });
			fs.rmSync(path.join(outDirPath, 'Dockerfile'), { force: true });
		}

		// remove PHPUnit files.
		if (userInputs.phpUnit === 'No') {
			fs.rmSync(path.join(outDirPath, 'tests'), { recursive: true, force: true });
			fs.rmSync(path.join(outDirPath, '.travis.yml'), { force: true });
			fs.rmSync(path.join(outDirPath, 'phpunit.xml.dist'), { force: true });
		}
	} catch (err) {
		spinner.fail(`${r(`Failed to generate plugin files.`)}\n`);
		throw err;
	}

	spinner.succeed(`${g(`PLUGIN FILES GENERATED!!!`)}\n`);
	return outDirPath;
};
