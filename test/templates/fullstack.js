const util = require('util');
const exec = util.promisify(require('child_process').exec);
const expect = require('chai').expect;
const initTemplate = require('../../utils/initTemplate');

const template = 'fullstack';

describe(`${template}`, function () {
  this.timeout(60000);
  initTemplate(template);

  it('sls info', async () => {
    const { stdout, stderr } = await exec('sls info', { cwd: template });
    expect(stdout).to.contain('Last Action');
    expect(stderr).to.equal('');
  });

  it('sls deploy --target vpc', async () => {
    const { stdout, stderr } = await exec('sls deploy --target vpc', { cwd: template });
    expect(stdout).to.contain('前往控制台查看应用详细信息');
    expect(stderr).to.equal('');
  })
});
