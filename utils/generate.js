const fs = require('fs');
const ora = require('ora');
const path = require('path');
const copy = require('copy-template-dir');
const shouldCancel = require('cli-should-cancel');
const { green: g, dim: d, red: r, yellow: y } = require('chalk');
const { choice } = require('./ask');
const shell = require('shelljs');
const spinner = ora({ text: '' });

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

const checkFolder = async (userInputs, outDirPath, outDirName) => {
	if (fs.existsSync(outDirPath)) {
		const proceed = await choice({
			name: 'question',
			message: `${r(
				`\n\nPlugin \"${outDirName}\" already exists in your current folder.`
			)}\n${y(
				`Do you want to continue, it will overwrite the existing folder?`
			)}`,
			choices: ['Overwrite', 'Cancel'],
			hint: `Use arrow key to change option type`
		});

		proceed === 'Cancel' && shouldCancel();
	} else if (fs.existsSync(path.join(outDirPath, 'inc'))) {
		const proceed = await choice({
			name: 'question',
			message: `${r(
				`\n\n'inc' folder already exists within your plugin's folder. `
			)}\n${y(
				`Choose Continue to overwrite | Cancel to bail out.`
			)}`,
			choices: ['Overwrite', 'Cancel'],
			hint: `Use arrow key to change option type`
		});

		proceed === 'Cancel' && shouldCancel();

	} else if (fs.existsSync(path.join(outDirPath, 'package.json'))) {
		const proceed = await choice({
			name: 'question',
			message: `${r(
				`\n\nPackage.json file already exists within your plugin's folder. `
			)}\n${y(`Choose Continue to overwrite | Cancel to bail out.`)}`,
			choices: ['Overwrite', 'Cancel'],
			hint: `Use arrow key to change option type`
		});

		proceed === 'Cancel' && shouldCancel();
	} else if (fs.existsSync(path.join(outDirPath, 'composer.json'))) {
		const proceed = await choice({
			name: 'question',
			message: `${r(
				`\n\ncomposer.json file already exists within your plugin's folder. `
			)}\n${y(`Choose Continue to overwrite | Cancel to bail out.`)}`,
			choices: ['Overwrite', 'Cancel'],
			hint: `Use arrow key to change option type`
		});

		proceed === 'Cancel' && shouldCancel();
	}
};

module.exports = async userInputs => {

	// Adds/Remove Gutenberg Blocks Support
	const packageBuildCommand = userInputs.blocks === 'No' ? 'js' : 'js:blocks';
	const pluginSupports = userInputs.blocks === 'Yes' ? `['blocks']` : '[]';

	userInputs = {
		reqWP: '5.3',
		reqPHP: '7.2',
		packageBuildCommand,
		pluginSupports,
		...userInputs
	};

	// setting input/output directories path and name.
	[inDirPath, outDirPath, outDirName] = await setDirectories(userInputs);

	// check if the plugin folder or files already exists in the current working directory.
	await checkFolder(userInputs, outDirPath, outDirName);

	return new Promise((resolve, reject) => {
		console.log();
		spinner.start(`${y(`Generating your plugin files...\n`)}`);
		copy(inDirPath, outDirPath, userInputs, (err, createdFiles) => {
			
			if (err) reject(err);

			// removing src/blocks from the output if plugin isn't going to register gutenberg blocks
			if(userInputs.blocks === 'No'){
				shell.exec(
					`rm -rf ${outDirPath}/src/blocks`,
					{silent: true}
				);
				inBlocks = path.join(__dirname, '../', 'templates/without-blocks');
				copy( inBlocks , outDirPath, userInputs, (err, createdFiles ) => {
					if(err) reject(err);
				} );
			}

			// removing docker files if devEnv is localWp
			if(userInputs.devEnv === 'LocalWP'){
				shell.exec(
					`rm -rf ${outDirPath}/docker-configs && rm ${outDirPath}/docker-compose.yaml && rm ${outDirPath}/Dockerfile`,
					{silent: true}
				);
			}

			// removing PHPUnit files
			if(userInputs.phpUnit === 'No'){
				shell.exec(
					`rm -rf ${outDirPath}/tests && rm ${outDirPath}/.travis.yml && rm ${outDirPath}/phpunit.xml.dist`,
					{silent: true}
				);
			}

			spinner.succeed(`${g(`PLUGIN FILES GENERATED!!!`)}\n`);
			resolve(outDirPath);
		});
	});
};
