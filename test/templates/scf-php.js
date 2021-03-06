const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('../../utils/execInFolder');
const expect = require('chai').expect;
const initTemplate = require('../../utils/initTemplate');

const template = 'scf-php';

describe(`${template}`, function () {
  this.timeout(200000);
  initTemplate(template);

  it('components info', async () => {
    const { stdout, stderr } = await execInFolder('components info', template);
    expect(stdout).to.contain('最后操作');
    expect(stderr).to.equal('');
  });
});
