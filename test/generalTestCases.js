const fs = require('fs');
const util = require('util');
const yaml = require('js-yaml');
const exec = util.promisify(require('child_process').exec);
const expect = require('chai').expect;
const execInFolder = require('../utils/execInFolder');

const projectFolder = 'example_scf_folder';

describe('General test cases', function () {
  this.timeout(200000);

  before('Init a project', async () => {
    const { stdout: versionInfo } = await exec(`sls -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...');
    const { stdout, stderr } = await exec(`sls init koa-starter --name ${projectFolder}`);
    expect(stdout).to.contain('Successfully');
    console.log('> Sample project initialized successfuly\n');

    console.log('SERVERLESS_PLATFORM_STAGE', process.env.SERVERLESS_PLATFORM_STAGE);

    // use koa@dev component in dev env because tencent team mantains that componet in dev env instead of koa component
    if (process.env.SERVERLESS_PLATFORM_STAGE === 'dev') {
      const yamlFile = fs.readFileSync(`${projectFolder}/serverless.yml`);
      const doc = yaml.safeLoad(yamlFile);
      doc.component = 'koa@dev';
      const newYaml = yaml.safeDump(doc);
      fs.writeFileSync(`${projectFolder}/serverless.yml`, newYaml, 'utf-8'); 
    }
  });

  after(async () => {
    console.log('\n> Test finished , removing resources...');
    const { stdout, stderr } = await execInFolder(`sls remove`, projectFolder);
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
    const { stdout, stderr } = await execInFolder('sls help', projectFolder);
    expect(stdout).to.contain('Serverless 指令');
    expect(stderr).to.equal('');
  });

  it('sls bind role', async () => {
    const { stdout, stderr } = await execInFolder('sls bind role', projectFolder);
    expect(stdout).to.contain('已成功开通 Serverless 相关权限');
    expect(stderr).to.equal('');
  });

  it('sls registry', async () => {
    const { stdout, stderr } = await execInFolder('sls registry')
    expect(stdout).contain('to install a template')
    expect(stderr).to.equal('')
  });

  it('sls publish template', async () => {
    const { stdout, stderr } = await execInFolder('sls publish', 'templateExample');
    expect(stdout).contain('Successfully');
    expect(stderr).to.equal('');
  });

  it('sls publish component', async () => {
    const { stdout, stderr } = await execInFolder('sls publish', 'componentExample');
    expect(stdout).contain('Successfully');
    expect(stderr).to.equal('');
  });

  it('sls registry to search a specific component: koa', async () => {
    const { stdout, stderr } = await execInFolder('sls registry koa')
    expect(stdout).contain('Component: koa')
    expect(stdout).contain(
      'Repo: https://github.com/serverless-components/tencent-koa/',
    )
    expect(stderr).to.equal('')
  });

  it('template/component not found', async () => {
    try {
      await exec('sls registry an_random_template_not_exists', { cwd: projectFolder })
    } catch (error) {
      // TODO: error message can be better
      expect(error.stdout).contain('not found');
    }
  });
  
  it('node_modules folder auto created', async () => {
    const exists = fs.existsSync(`${projectFolder}/node_modules`, 'utf8');
    expect(exists).to.be.true;
  });

  it('proper name is auto generated in yml', async () => {
    const doc = yaml.safeLoad(fs.readFileSync(`${projectFolder}/serverless.yml`));
    expect(doc.app).to.equal(projectFolder);
  });

  it('throws error when the region in serverless.yml is not right: e.g. ap-abc', async () => {
    const yamlFile = fs.readFileSync(`${projectFolder}/serverless.yml`);
    const doc = yaml.safeLoad(yamlFile);
    doc.inputs.region = 'ap-abc';
    const newYaml = yaml.safeDump(doc);
    fs.writeFileSync(`${projectFolder}/serverless.yml`, newYaml, 'utf-8');

    try {
      await exec('sls deploy', { cwd: projectFolder });
    } catch (error) {
      // console.log(error);

      // TODO: the error message can be better, 
      // sometimes: ENOTFOUND serverless-ap-abc-code-1303241281.cos.ap-abc.myqcloud.com serverless-ap-abc-code-1303241281.cos.ap-abc.myqcloud.com:443
      // sometimes: A value specified in `Region` is not valid, is unsupported, or cannot be used. (reqId: 6552d8f3-1de7-416a-9e56-756a9a958ae6)
      expect(error.stdout).contain('帮助文档');
    }

    // write back correct yaml file
    fs.writeFileSync(`${projectFolder}/serverless.yml`, yamlFile, 'utf-8');
  });

  it('throws error when component does not exist', async () => {
    const yamlFile = fs.readFileSync(`${projectFolder}/serverless.yml`);
    const doc = yaml.safeLoad(yamlFile);
    doc.component = 'a_componet_that_does_not_exist';
    const newYaml = yaml.safeDump(doc);

    fs.writeFileSync(`${projectFolder}/serverless.yml`, newYaml, 'utf-8');

    try {
      await exec('sls deploy', { cwd: projectFolder });
    } catch (error) {
      // console.log(error);

      // TODO: the error message can be better
      expect(error.stdout).contain('不存在');
    }

    // write back correct yaml file
    fs.writeFileSync(`${projectFolder}/serverless.yml`, yamlFile, 'utf-8');
  });

  describe('sls deploy', () => {
    it('sls deploy', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy', projectFolder);
      expect(stdout).to.contain('前往控制台查看应用详细信息');
      expect(stderr).to.equal('');
    });

    it('sls deploy --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls deploy --debug', projectFolder);
      expect(stdout).to.contain('前往控制台查看应用详细信息');
      expect(stderr).to.equal('');
    });

    // Not testing region switching, as after switching region, serverless will create multiple scf instances
    // it('sls deploy --inputs region="ap-shanghai"', async () => {
    //   const { stdout, stderr } = await execInFolder('sls deploy --inputs region="ap-shanghai"', projectFolder);
    //   expect(stdout).to.contain('ap-shanghai');
    //   expect(stderr).to.equal('');
    // });

    it('use unexisted method: sls abc', async () => {
      try {
        await exec('sls abc', { cwd: projectFolder })
      } catch (error) {
        // TODO: error message can be better
        expect(error.stdout).contain('Component does not have the method:');
      }
    });

    it('--input error: e.g. sls deploy --inputs region=ap-abc"', async () => {
      try {
        await exec('sls deploy --inputs region="ap-abc"', { cwd: projectFolder });
      } catch (error) {
        // TODO: the error message can be better
        expect(error.stdout).contain('帮助文档');
      }
    });

    it('sls deploy --target failed because target folder is not a serverless project', async () => {
      try {
        await exec('sls deploy --target node_modules', { cwd: projectFolder });
      } catch (error) {
        expect(error.stdout).contain('serverless config file was not found');
      }
    });

    it('sls info', async () => {
      const { stdout, stderr } = await execInFolder('sls info', projectFolder);
      expect(stdout).to.contain('Last Action');
      expect(stderr).to.equal('');
    });

    it('sls info --debug', async () => {
      const { stdout, stderr } = await execInFolder('sls info --debug', projectFolder);
      expect(stdout).to.contain('Last Action:');
      expect(stdout).to.contain('State:');
      expect(stderr).to.equal('');
    });
  });

});
