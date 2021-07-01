const util = require('util');
const exec = util.promisify(require('child_process').exec);
const execInFolder = require('../../utils/execInFolder');
const expect = require('chai').expect;
const initTemplate = require('../../utils/initTemplate');

const template = 'multi-scf-nodejs';

describe(`${template}`, function () {
  this.timeout(200000);
  initTemplate(template);

  it('components info', async () => {
    const { stdout, stderr } = await execInFolder('components info', template);
    expect(stdout).to.contain('最后操作');
    expect(stderr).to.equal('');
  });

  it('components invoke local', async () => {
    const { stdout, stderr } = await execInFolder('components invoke local --function index', template);
    expect(stdout).to.contain('调用成功');
    expect(stderr).to.equal('');
  });

  it('components invoke', async () => {
    const { stdout, stderr } = await execInFolder('components invoke --function index', template);
    expect(stdout).to.contain('调用成功');
    expect(stderr).to.equal('');
  });

  it('components logs', async () => {
	  const { stdout, stderr } = await execInFolder('components logs --function index', template);
    expect(stdout).to.contain('获取日志成功');
    expect(stderr).to.equal('');
  });

});
