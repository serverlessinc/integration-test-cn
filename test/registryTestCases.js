const util = require('util')
const fs = require('fs')
const exec = util.promisify(require('child_process').exec)
const expect = require('chai').expect

const templateName = 'tencent-react-starter'
const execInFolder = async (cmd, path) => {
  let res = {};
  try {
    res = await exec(cmd, { cwd: path });
  } catch (error) {
    console.error(error);
  }
  return res;
}

describe('Registry related', function () {
  this.timeout(200000)

  before('Init a template project for testing registry publish', async () => {
    const { stdout: versionInfo } = await exec(`sls -v`)
    console.log(versionInfo)
    console.log('start init template project')
    await exec(
      `git clone -b ci-test https://github.com/serverless-components/tencent-react-starter.git`,
    )

    expect(fs.lstatSync(templateName).isDirectory()).eq(true)
    console.log('init successfully')
  })

  after(async () => {
    console.log('Test finished. remove useless resource')
    await exec(`rm -rf ${templateName}`)
  })

  it('sls registry', async () => {
    const { stdout, stderr } = await execInFolder('sls registry')
    expect(stdout).contain('to install a template')
    expect(stderr).to.equal('')
  })

  it('sls registry to search a specific component: koa', async () => {
    const { stdout, stderr } = await execInFolder('sls registry koa')
    expect(stdout).contain('Component: koa')
    expect(stdout).contain(
      'Repo: https://github.com/serverless-components/tencent-koa/',
    )
    expect(stderr).to.equal('')
  })

  it('template/component not found', async () => {
    try {
      await execInFolder('sls registry an_random_template_not_exists')
    } catch (error) {
      // TODO: error message can be better
      expect(error.stdout).contain('not found');
    }
  })

  /* it('sls publish react-start-test component', async () => {
('sls publish', templateName)
    expect(stdout).contain('Successfully published react-starter-test')
    expect(stderr).to.equal('')
    const { stdout: stdout2 } = await execInFolder(
      'sls registry react-starter-test',
    )
    expect(stdout2).contain('Template: react-starter-test')
  }) */
})
