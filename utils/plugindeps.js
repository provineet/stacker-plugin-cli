const alert = require('cli-alerts');

module.exports = dirName => {
	alert({
		type: `success`,
		msg: `🎉 Alright Sparky, Now develop something amazing.\n\nTo Begin; open the generated plugin's folder in your terminal and run below commands:\nnpm install\ncomposer install\nnpm run start.\n\nCheckout the boilerplate documentation here:\nhttps://github.com/provineet/stacker-plugin-boilerplate/`,
		name: `Plugin Files Generated!!!`
	});

};
