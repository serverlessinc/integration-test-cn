const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('../../utils/execInFolder');
const expect = require('chai').expect;
const initTemplate = require('../../utils/initTemplate');

const template = 'scf-starter';

describe(`${template}`, function () {
  this.timeout(200000);
  initTemplate(template);

  it('sls info', async () => {
    const { stdout, stderr } = await execInFolder('sls info', template);
    expect(stdout).to.contain('最后操作');
    expect(stderr).to.equal('');
  });

  it('sls invoke local', async () => {
    const { stdout, stderr } = await execInFolder('sls invoke', template);
    expect(stdout).to.contain('调用成功');
    expect(stderr).to.equal('');
  });

  it('sls invoke', async () => {
    const { stdout, stderr } = await execInFolder('sls invoke', template);
    expect(stdout).to.contain('调用成功');
    expect(stderr).to.equal('');
  });

});
