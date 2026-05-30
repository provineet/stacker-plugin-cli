const fs = require('fs');
const ora = require('ora');
const path = require('path');
const copyDir = require('./copydir');
const shouldCancel = require('cli-should-cancel');
const { green: g, dim: d, red: r, yellow: y } = require('chalk');
const { choice } = require('./ask');
const spinner = ora({ text: '' });

const setDirectories = async (userInputs, pluginFolder = null) => {
	const outDirName =
		pluginFolder == null
			? userInputs.pluginFileName
			: pluginFolder;
	const outDirPath = path.join(process.cwd(), outDirName);
	const inDirPath = path.join(__dirname, '../', 'templates/fresh');

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

const checkFolder = async (outDirPath, outDirName) => {
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
		reqWP: '6.0',
		reqPHP: '8.1',
		year: new Date().getFullYear(),
		packageBuildCommand,
		pluginSupports,
		assetsFolder,
		...userInputs
	};

	// setting input/output directories path and name.
	const [inDirPath, outDirPath, outDirName] = await setDirectories(userInputs);

	// check if the plugin folder or files already exists in the current working directory.
	await checkFolder(outDirPath, outDirName);

	console.log();
	spinner.start(`${y(`Generating your plugin files...\n`)}`);

	try {
		// copy the base template into the output directory.
		await copyDir(inDirPath, outDirPath, userInputs);

		// remove src/blocks if the plugin isn't going to register gutenberg blocks.
		if (userInputs.blocks === 'No') {
			fs.rmSync(path.join(outDirPath, 'src/blocks'), { recursive: true, force: true });
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
