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
    console.log('\n> Starting tests, initing a sample project...');
    const { stdout, stderr } = await exec(`sls init express-starter --name ${projectFolder}`);
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
  });

  it('sls help', async () => {
    const { stdout, stderr } = await execInFolder('sls help');
    expect(stdout).to.contain('Serverless 指令');
  });

  describe('sls deploy', () => {
    it('sls deploy', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy');
      expect(stdout).to.contain('Full details:');
    });
    it('sls deploy --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --debug');
      expect(stdout).to.contain('Full details:');
    });
  });
});
