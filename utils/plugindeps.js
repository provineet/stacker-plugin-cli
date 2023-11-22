const shell = require('shelljs');
const ora = require('ora');
const { red: r, yellow: y, green: g, dim: d, blue: b, orange: o } = require('chalk');
const alert = require('cli-alerts');

const spinner = ora({ text: '' });

module.exports = dirName => {
	// Bug Fix: escape space in directory path
	dirName = dirName.replace(/(\s+)/g, '\\$1');

	// return new Promise((resolve, reject) => {
		spinner.start(
		`${y(`📦📦📦 INSTALLING PLUGIN DEPENDENCIES... 📦📦📦`)}\n\n${d(
			`It may take moment…\n\n`
		)}`);

		shell.exec(
			`cd ${dirName} && git init && echo 'GIT Initialized' && npm i && composer install && npm run build`,
			{ async: true, silent: false },
			function (code, stdout, stderr) {
				if (code == 0) {
					spinner.succeed(`${g(`🚀🚀🚀 PLUGIN DEPENDENCIES INSTALLED...`)}`);
	
					alert({
						type: `success`,
						msg: `🎉 Alright Sparky, Now develop something amazing.\n\nTo start developing the plugin checkout the boilerplate documentation here:\nhttps://github.com/provineet/stacker-plugin-boilerplate/`,
						name: `ALL DONE`
					});
				} else {
					spinner.fail(
						`${r(
							`${stderr}\n\nFAILED TO INSTALL DEPENDENCIES, KINDLY RESTART or CONTACT THE MAINTAINER @provineet...`
						)}`
					);
				}
			}
		);

};
