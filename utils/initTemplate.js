const util = require('util');
const exec = util.promisify(require('child_process').exec);
const expect = require('chai').expect;

module.exports = (template) => {
  before('Init a project', async () => {
    const { stdout: versionInfo } = await exec(`sls -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...')
    const { stdout, stderr } = await exec(`sls init ${template}`);
    expect(stdout).to.contain('Successfully');
    console.log('> Sample project initialized successfuly\n');
  });

  after(async () => {
    console.log('\n> Test finished , removing resources...');
    const { stdout, stderr } = await exec(`sls remove`, { cwd: template });
    expect(stdout).to.contain('Success');
    await exec(`rm -rf ${template}`);
    console.log('> Instance code is removed locally and remotely');
  });

  it('sls deploy', async () => {
    const { stdout, stderr } = await exec(`sls deploy`, { cwd: template });
    expect(stdout).to.contain('前往控制台查看应用详细信息');
    expect(stderr).to.equal('');
  });
}