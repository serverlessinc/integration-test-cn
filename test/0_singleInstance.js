const util = require('util');
const exec = util.promisify(require('child_process').exec);
const expect = require('chai').expect;

const projectFolder = 'example_scf_folder';

const execInFolder = async (cmd) => {
  return exec(cmd, { cwd: projectFolder });
}

describe('Single instance', function () {
  this.timeout(60000);

  before('Init a project', async () => {
    const { stdout: versionInfo } = await exec(`sls -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...');
    const { stdout, stderr } = await exec(`sls init koa-starter --name ${projectFolder}`);
    expect(stdout).to.contain('Successfully');
    console.log('> Sample project initialized successfuly\n');
  });

  after(async () => {
    console.log('\n> Test finished , removing resources...');
    const { stdout, stderr } = await execInFolder(`sls remove`);
    expect(stdout).to.contain('Success');
    await exec(`rm -rf ${projectFolder}`);
    console.log('> Instance code is remove locally and remotely');
  })

  it('sls -v', async () => {
    const { stdout, stderr } = await exec('sls -v');
    expect(stdout).to.contain('Framework Core:');
    expect(stderr).to.equal('');
  });

  it('sls help', async () => {
    const { stdout, stderr } = await execInFolder('sls help');
    expect(stdout).to.contain('Serverless 指令');
    expect(stderr).to.equal('');
  });

  it('sls bind role', async () => {
    const { stdout, stderr } = await execInFolder('sls bind role');
    expect(stdout).to.contain('已成功开通 Serverless 相关权限');
    expect(stderr).to.equal('');
  });

  describe('sls deploy', () => {
    it('sls deploy', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy');
      expect(stdout).to.contain('前往控制台查看应用详细信息');
      expect(stderr).to.equal('');
    });

    it('sls deploy --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --debug');
      expect(stdout).to.contain('前往控制台查看应用详细信息');
      expect(stderr).to.equal('');
    });

    it('sls deploy --inputs region="ap-shanghai"', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --inputs region="ap-shanghai"');
      expect(stdout).to.contain('ap-shanghai');
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
