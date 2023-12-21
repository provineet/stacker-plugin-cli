const shell = require('shelljs');
const ora = require('ora');
const { red: r, yellow: y, green: g, dim: d, blue: b, orange: o } = require('chalk');
const alert = require('cli-alerts');

const spinner = ora({ text: '' });

module.exports = dirName => {
	alert({
		type: `success`,
		msg: `🎉 Alright Sparky, Now develop something amazing.\n\nTo Begin; open the generated plugin's folder in your terminal and run below commands:\nnpm install\ncomposer install\nnpm run start.\n\nCheckout the boilerplate documentation here:\nhttps://github.com/provineet/stacker-plugin-boilerplate/`,
		name: `Plugin Files Generated!!!`
	});

};
