const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('../../utils/execInFolder');
const expect = require('chai').expect;
const initTemplate = require('../../utils/initTemplate');

const template = 'eggjs-starter';

describe(`${template}`, function () {
  this.timeout(200000);
  initTemplate(template);

  it('components info', async () => {
    const { stdout, stderr } = await execInFolder('components info', template);
    expect(stdout).to.contain('最后操作');
    expect(stderr).to.equal('');
  });

  it('components deploy without serverless.yml (remove serverless.yml first)', async () => {
    await execInFolder('rm serverless.yml', template);
    const { stdout, stderr } = await execInFolder(
      'components deploy',
      template,
    );
    expect(stdout).to.contain('应用控制台');
    expect(stderr).to.equal('');
  });
});
