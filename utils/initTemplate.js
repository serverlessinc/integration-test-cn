const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('./execInFolder');

const expect = require('chai').expect;

module.exports = (template) => {
  before('Init a project', async () => {
    const { stdout: versionInfo } = await exec(`components -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...')
    const { stdout, stderr } = await exec(`components init ${template}`);
    expect(stdout).to.contain('创建成功');
    console.log('> Sample project initialized successfuly\n');
  });

  after(async () => {
    console.log('\n> Test finished , removing resources...');
    const { stdout, stderr } = await execInFolder(`components remove`, template);
    expect(stdout).to.contain('执行成功');
    await exec(`rm -rf ${template}`);
    console.log('> Instance code is removed locally and remotely');
  });

  it('components deploy', async () => {
    const { stdout, stderr } = await execInFolder(`components deploy`, template);
    expect(stdout).to.contain('应用控制台');
    expect(stderr).to.equal('');
  });
}
