const util = require('util');
const exec = util.promisify(require('child_process').exec);
const expect = require('chai').expect;

const projectFolder = 'example_nested_project';

const execInFolder = async (cmd) => {
  return exec(cmd, { cwd: projectFolder });
}

describe('Nested template', function () {
  this.timeout(600000);

  before('Init a project', async () => {
    const { stdout: versionInfo } = await exec(`sls -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...');
    const { stdout, stderr } = await exec(`sls init fullstack --name ${projectFolder}`);
    expect(stdout).to.contain('Successfully');
    expect(stderr).to.equal('');
    console.log('> Sample project initialized successfuly\n');
  });

  after(async () => {
    console.log('\n> Test finished , removing resources...');
    const { stdout, stderr } = await execInFolder(`sls remove`);
    expect(stdout).to.contain('successfully');
    expect(stderr).to.equal('');
    await exec(`rm -rf ${projectFolder}`);
    console.log('> Instance code is remove locally and remotely');
  })

  describe('sls deploy', () => {
    it('sls deploy --target vpc', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --target vpc');
      expect(stdout).to.contain('前往控制台查看应用详细信息');
      expect(stderr).to.equal('');
    })
    it('sls deploy', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy');
      expect(stdout).to.contain('successfully');
      expect(stderr).to.equal('');
    });
    it('sls deploy --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --debug');
      expect(stdout).to.contain('successfully');
      expect(stderr).to.equal('');
    });
    it('sls info', async () => {
      const { stdout, stderr } = await execInFolder('sls info');
      expect(stdout).to.contain('Last Action');
      expect(stderr).to.equal('');
    });
    it('sls info --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls info --debug');
      expect(stdout).to.contain('Last Action');
      expect(stderr).to.equal('');
    });
  });
});
