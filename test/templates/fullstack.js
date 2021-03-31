const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('../../utils/execInFolder');
const expect = require('chai').expect;

const template = 'fullstack';

describe(`${template}`, function () {
  this.timeout(200000);

  before('Init a project', async () => {
    const { stdout: versionInfo } = await exec(`sls -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...');
    const { stdout, stderr } = await exec(`sls init fullstack --name ${template}`);
    expect(stdout).to.contain('Successfully');
    expect(stderr).to.equal('');
    console.log('> Sample project initialized successfully\n');
  });

  after(async () => {
    console.log('\n> Test finished , removing resources...');
    const { stdout, stderr } = await execInFolder(`sls remove`, template);
    expect(stdout).to.contain('successfully');
    expect(stderr).to.equal('');
    await exec(`rm -rf ${template}`);
    console.log('> Instance code is remove locally and remotely');
  })

  describe('sls deploy', () => {
    it('sls deploy --target vpc', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --target vpc', template);
      expect(stdout).to.contain('应用控制台');
      expect(stderr).to.equal('');
    })
    it('sls deploy', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy', template);
      expect(stdout).to.contain('successfully');
      expect(stderr).to.equal('');
    });
    it('sls deploy --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --debug', template);
      expect(stdout).to.contain('successfully');
      expect(stderr).to.equal('');
    });
    it('sls info', async () => {
      const { stdout, stderr } = await execInFolder('sls info', template);
      expect(stdout).to.contain('最后操作');
      expect(stderr).to.equal('');
    });
    it('sls info --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls info --debug', template);
      expect(stdout).to.contain('最后操作');
      expect(stderr).to.equal('');
    });
  });
});
