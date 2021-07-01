const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('../../utils/execInFolder');
const expect = require('chai').expect;

const template = 'fullstack';

describe(`${template}`, function () {
  this.timeout(200000);

  before('Init a project', async () => {
    const { stdout: versionInfo } = await exec(`components -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...');
    const { stdout, stderr } = await exec(`components init fullstack --name ${template}`);
    expect(stdout).to.contain('创建成功');
    expect(stderr).to.equal('');
    console.log('> Sample project initialized successfully\n');
  });

  after(async () => {
    console.log('\n> Test finished , removing resources...');
    const { stdout, stderr } = await execInFolder(`components remove`, template);
    expect(stdout).to.contain('successfully');
    expect(stderr).to.equal('');
    await exec(`rm -rf ${template}`);
    console.log('> Instance code is remove locally and remotely');
  })

  describe('components deploy', () => {
    it('components deploy --target vpc', async () => {
      const { stdout, stderr } = await execInFolder('components deploy --target vpc', template);
      expect(stdout).to.contain('应用控制台');
      expect(stderr).to.equal('');
    })
    it('components deploy', async () => {
      const { stdout, stderr } = await execInFolder('components deploy', template);
      expect(stdout).to.contain('successfully');
      expect(stderr).to.equal('');
    });
    it('components deploy --debug', async () => {
      const { stdout, stderr } = await execInFolder('components deploy --debug', template);
      expect(stdout).to.contain('successfully');
      expect(stderr).to.equal('');
    });
    it('components info', async () => {
      const { stdout, stderr } = await execInFolder('components info', template);
      expect(stdout).to.contain('最后操作');
      expect(stderr).to.equal('');
    });
    it('components info --debug', async () => {
      const { stdout, stderr } = await execInFolder('components info --debug', template);
      expect(stdout).to.contain('最后操作');
      expect(stderr).to.equal('');
    });
  });
});
