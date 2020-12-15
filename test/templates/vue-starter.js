const util = require('util');
const exec = util.promisify(require('child_process').exec);
const expect = require('chai').expect;
const initTemplate = require('../../utils/initTemplate');

const template = 'vue-starter';

describe(`${template}`, function () {
  this.timeout(60000);
  initTemplate(template);

  it('sls info', async () => {
    const { stdout, stderr } = await exec('sls info', { cwd: template });
    expect(stdout).to.contain('Last Action');
    expect(stderr).to.equal('');
  });

});
