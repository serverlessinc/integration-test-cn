const util = require('util')
const fs = require('fs')
const exec = util.promisify(require('child_process').exec)
const expect = require('chai').expect

const templateName = 'tencent-react-starter'
const execInFolder = (cmd, path) => {
  return exec(cmd, { cwd: path })
}

describe('Run registry command', function () {
  this.timeout(60000)

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

  it('sls publish react-start-test component', async () => {
    const { stdout, stderr } = await execInFolder('sls publish', templateName)
    expect(stdout).contain('Successfully published react-starter-test')
    expect(stderr).to.equal('')
  })
})
