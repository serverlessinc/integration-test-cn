const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('../../utils/execInFolder');
const expect = require('chai').expect;
const initTemplate = require('../../utils/initTemplate');

const template = 'eggjs-starter';

describe(`${template}`, function () {
  this.timeout(200000);
  initTemplate(template);

  it('sls info', async () => {
    const { stdout, stderr } = await execInFolder('sls info', template);
    expect(stdout).to.contain('Last Action');
    expect(stderr).to.equal('');
  });
});
