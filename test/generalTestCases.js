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
    const { stdout: versionInfo } = await exec(`components -v`);
    console.log(versionInfo);
    console.log('\n> Starting tests, initing a sample project...');
    const { stdout, stderr } = await exec(`components init koa-starter --name ${projectFolder}`);
    expect(stdout).to.contain('创建成功');
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
    const { stdout, stderr } = await execInFolder(`components remove`, projectFolder);
    expect(stdout).to.contain('执行成功');
    await exec(`rm -rf ${projectFolder}`);
    console.log('> Instance code is remove locally and remotely');
  });

  it('components -v', async () => {
    const { stdout, stderr } = await exec('components -v');
    expect(stdout).to.contain('Framework Core:');
    expect(stderr).to.equal('');
  });

  it('components help', async () => {
    const { stdout, stderr } = await execInFolder('components help', projectFolder);
    expect(stdout).to.contain('命令');
    expect(stderr).to.equal('');
  });

  it('components bind role', async () => {
    const { stdout, stderr } = await execInFolder('components bind role', projectFolder);
    expect(stdout).to.contain('已成功开通 Serverless 相关权限');
    expect(stderr).to.equal('');
  });

  it('components registry', async () => {
    const { stdout, stderr } = await execInFolder('components registry')
    expect(stdout).contain('serverless init')
    expect(stderr).to.equal('')
  });

  it('components publish template', async () => {
    const { stdout, stderr } = await execInFolder('components publish', 'templateExample');
    expect(stdout).contain('发布成功');
    expect(stderr).to.equal('');
  });

  it('components publish component', async () => {
    const { stdout, stderr } = await execInFolder('components publish', 'componentExample');
    expect(stdout).contain('发布成功');
    expect(stderr).to.equal('');
  });

  it('components registry to search a specific component: koa', async () => {
    const { stdout, stderr } = await execInFolder('components registry koa')
    expect(stdout).contain('代码地址')
    expect(stderr).to.equal('')
  });

  it('template/component not found', async () => {
    try {
      await exec('components registry an_random_template_not_exists', { cwd: projectFolder })
    } catch (error) {
      // TODO: error message can be better
      expect(error.stdout).contain('不存在');
    }
  });

  it('node_modules folder auto created', async () => {
    const exists = fs.existsSync(`${projectFolder}/node_modules`, 'utf8');
    expect(exists).to.be.true;
  });

  it('proper name is auto generated in yml', async () => {
    const doc = yaml.safeLoad(fs.readFileSync(`${projectFolder}/serverless.yml`));
    expect(doc.app).contain(projectFolder);
  });

  it('throws error when the region in serverless.yml is not right: e.g. ap-abc', async () => {
    const yamlFile = fs.readFileSync(`${projectFolder}/serverless.yml`);
    const doc = yaml.safeLoad(yamlFile);
    doc.inputs.region = 'ap-abc';
    const newYaml = yaml.safeDump(doc);
    fs.writeFileSync(`${projectFolder}/serverless.yml`, newYaml, 'utf-8');

    try {
      await exec('components deploy', { cwd: projectFolder });
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
      await exec('components deploy', { cwd: projectFolder });
    } catch (error) {
      // console.log(error);

      // TODO: the error message can be better
      expect(error.stdout).contain('不存在');
    }

    // write back correct yaml file
    fs.writeFileSync(`${projectFolder}/serverless.yml`, yamlFile, 'utf-8');
  });

  describe('components deploy', () => {
    it('components deploy', async () => {
      const { stdout, stderr } = await execInFolder('components deploy', projectFolder);
      expect(stdout).to.contain('应用控制台');
      expect(stderr).to.equal('');
    });

    it('components deploy --debug', async () => {
      const { stdout, stderr } = await execInFolder('components deploy --debug', projectFolder);
      expect(stdout).to.contain('应用控制台');
      expect(stderr).to.equal('');
    });

    // Not testing region switching, as after switching region, serverless will create multiple scf instances
    // it('components deploy --inputs region="ap-shanghai"', async () => {
    //   const { stdout, stderr } = await execInFolder('components deploy --inputs region="ap-shanghai"', projectFolder);
    //   expect(stdout).to.contain('ap-shanghai');
    //   expect(stderr).to.equal('');
    // });

    it('use unexisted method: components abc', async () => {
      try {
        await exec('components abc', { cwd: projectFolder })
      } catch (error) {
        // TODO: error message can be better
        expect(error.stdout).contain('请检查该命令是否存在');
      }
    });

    it('--input error: e.g. components deploy --inputs region=ap-abc"', async () => {
      try {
        await exec('components deploy --inputs region="ap-abc"', { cwd: projectFolder });
      } catch (error) {
        // TODO: the error message can be better
        expect(error.stdout).contain('帮助文档');
      }
    });

    it('components deploy --target failed because target folder is not a serverless project', async () => {
      try {
        await exec('components deploy --target node_modules', { cwd: projectFolder });
      } catch (error) {
        expect(error.stdout).contain('没有找到serverless配置文件，请检查');
      }
    });

    it('components info', async () => {
      const { stdout, stderr } = await execInFolder('components info', projectFolder);
      expect(stdout).to.contain('最后操作');
      expect(stderr).to.equal('');
    });

    it('components info --debug', async () => {
      const { stdout, stderr } = await execInFolder('components info --debug', projectFolder);
      expect(stdout).to.contain('最后操作:');
      expect(stdout).to.contain('State:');
      expect(stderr).to.equal('');
    });

    // it('components logs', async () => {
    //   const { stdout, stderr } = await execInFolder('components logs', projectFolder);
    //   expect(stdout).to.contain('获取日志成功');
    //   expect(stderr).to.equal('');
    // });
  });

});
