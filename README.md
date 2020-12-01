# Integration test suite for tencent-serverless

## Usage

### Locally

```bash
# create a .env file and fill it with secret key
touch .env

# install latest serverless framework(used to test)
npm i serverless -g

# install local dependencies
npm i

# run tests
npm test
```

### On coding.net CI

Trigger coding CI with API call: https://help.coding.net/docs/ci/trigger.html


### On GitHub action

https://github.com/serverlessinc/integration-test-cn