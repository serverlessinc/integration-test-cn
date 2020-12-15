const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = async (cmd, path) => {
	let res = {};
	try {
		res = await exec(cmd, { cwd: path });
	} catch (error) {
		console.error(error);
	}
	return res;
}