const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');
const exec = util.promisify(require('child_process').exec);
const expect = require('chai').expect;

const projectFolder = 'example_scf_folder';

const execInFolder = async (cmd) => {
  return exec(cmd, { cwd: projectFolder });
}

describe('General test cases', function () {
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
  });

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

  it('node_modules folder auto created', async () => {
    const exists = fs.existsSync(`${projectFolder}/node_modules`, 'utf8');
    expect(exists).to.be.true;
  });

  it('proper name in yml', async () => {
    const doc = yaml.safeLoad(fs.readFileSync(`${projectFolder}/serverless.yml`));
    expect(doc.app).to.equal(projectFolder);
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

    it('use unexisted method: sls abc', async () => {
      try {
        await execInFolder('sls abc')
      } catch (error) {
        // TODO: error message can be better
        expect(error.stdout).contain('Component does not have the method:');
      }
    });

    it('--input error: e.g. sls deploy --inputs region=ap-abc"', async () => {
      try {
        await execInFolder('sls deploy --inputs region="ap-abc"');
      } catch (error) {
        // TODO: the error message can be better
        expect(error.stdout).contain('ENOTFOUND');
      }
    });

    it('sls deploy --target failed because target folder is not a serverless project', async () => {
      try {
        await execInFolder('sls deploy --target node_modules');
      } catch (error) {
        expect(error.stdout).contain('serverless config file was not found');
      }
    });

    it('sls info', async () => {
      const { stdout, stderr } = await execInFolder('sls info');
      expect(stdout).to.contain('Last Action');
      expect(stderr).to.equal('');
    });

    it('sls info --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls info --debug');
      expect(stdout).to.contain('Last Action:');
      expect(stdout).to.contain('State:');
      expect(stderr).to.equal('');
    });
  });

});
