const ShouldCancel = require('cli-should-cancel');
const { blue: b, dim: d, yellow: y, red: r } = require('chalk');

const { confirm, simpleText, choice } = require('./ask');
const validations = require('./validations');

let validate = validations.notEmpty;

function strToCamelCase(str) {
    // Using replace method with regEx
    return str.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return word.toUpperCase();
    }).replace(/\s+/g, ' ');
}

const inputs = async () => {

	// take user inputs
	const userInputs = await freshInstall();

	// take confirmation on the user inputs
	const confirmInputs = await confirm({
		message: 'Do you want to proceed with the above config?'
	});

	if (confirmInputs === 'Yes') {
		userInputs.name = userInputs.name.trim();
		userInputs.namespace = strToCamelCase(userInputs.name).replace(/ /g, "_").toUpperCase();
		userInputs.pluginFileName = userInputs.name.toLowerCase().replace(/ /g, "-");
		userInputs.constantPrefix = userInputs.prefix.toUpperCase();
		return userInputs;
	} else if (confirmInputs === 'Restart') {
		return 'Restart';
	} else {
		ShouldCancel();
	}
};

const freshInstall = async () => {
	
	const blocks = await choice({
		message: 'Is your plugin registers Gutenberg blocks?',
		choices: ['Yes', 'No'],
	});
	const phpUnit = await choice({
		message: 'Configure PHPUnit?',
		choices: ['Yes', 'No'],
	});
	const devEnv = await choice({
		message: 'Which of the following development environment you are using?',
		choices: ['Docker Desktop', 'LocalWP'],
	});
	const pluginName = await simpleText({
		message: 'Name of your Plugin?',
		hint: null,
		validate,
		initial: 'Plugin Name'
	});
	const version = await simpleText({
		message: 'Plugin Version',
		validate: validations.version,
		initial: '1.0.0'
	});
	const textDomain = await simpleText({
		message: "Your plugin's text domain",
		hint: null,
		initial: pluginName.trim().toLowerCase().replace(/ /g, "-"),
		validate
	});
	const prefix = await simpleText({
		message: "Your plugin's prefix",
		hint: 'prefix to be used to namespace plugin\'s global functions and constants.',
		initial: pluginName.trim().toLowerCase().replace(/ /g, "_"),
		validate
	});
	const pluginUrl = await simpleText({
		message: 'Plugin Url',
		initial: 'https://blogohblog.com',
		hint: null
	});
	const description = await simpleText({
		message: 'Description',
		hint: null,
		initial: 'My awesome WordPress Plugin.'
	});
	const authorName = await simpleText({
		message: 'Author Name',
		hint: null,
		initial: 'Vineet',
	});
	const authorUrl = await simpleText({
		message: 'Author Url',
		hint: null,
		initial: 'https://blogohblog.com',
	});
	const packageName = await simpleText({
		message: 'Package name for @package directive for plugin files',
		hint: null,
		initial: strToCamelCase( pluginName.trim() ),
	});
	const license = await simpleText({
		message: 'License',
		hint: null,
		validate,
		initial: 'GPL-3.0-or-later'
	});
	const proxyInitial = (devEnv === 'LocalWP') ? 'localwp.test' : 'localhost:8080';
	const proxy = await simpleText({
		message: 'Your local development URL to Proxy?',
		hint: 'This is your local development URL to access your WordPress locally (To setup hot-reloading)',
		initial: proxyInitial
	});

	console.log(`
    ${y(
		`Configuring a fresh installation of Stacker Plugin Boilerplate.`
	)}}

    ${d(`Plugin Name`)}: ${b(pluginName)}
    ${d(`Version`)}: ${b(version)}
    ${d(`Text Domain`)}: ${b(textDomain)}
    ${d(`Function Prefix`)}: ${b(prefix)}
    ${d(`Plugin Url`)}: ${b(pluginUrl)}
    ${d(`Description`)}: ${b(description)}
    ${d(`Author Name`)}: ${b(authorName)}
    ${d(`Author Url`)}: ${b(authorUrl)}
    ${d(`@Package`)}: ${b(packageName)}
    ${d(`License`)}: ${b(license)}
    ${d(`Development Environment`)}: ${b(devEnv)}
    ${d(`Local Development URL`)}: ${b(proxy)}
    ${d(`Is your plugin registers Gutenberg Blocks?`)}: ${b(blocks)}

    `);

	return {
		name: pluginName,
		version,
		textDomain,
		pluginUrl,
		description,
		authorName,
		authorUrl,
		packageName,
		blocks,
		license,
		devEnv,
		proxy,
		prefix,
		phpUnit
	};
};

module.exports = inputs;
