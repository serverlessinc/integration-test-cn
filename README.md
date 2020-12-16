> Run integration tests coding CI: https://sftest11.coding.net/p/integration-test-cn/ci/job
> This repo will be synced to coding.net every day

## Usage

### Prepare

```bash
# create a .env file and fill it with secret keys
touch .env

# install local dependencies
npm i

# install latest serverless framework (used to test)
npm i serverless -g
```

### Run Tests

1. Run general test cases on PROD env

```bash
# run general integration tests
npm run test
```

1. Run tests for a specific template
```bash
# run tests for a specific template
npm run test-template express-starter
```

1. Run general integraion tests for DEV environment
```bash
# run integraion tests on DEV env
SERVERLESS_PLATFORM_STAGE=dev npm run test
```

## Trigger tests on coding CI

### DEV environment

After releasing new feature to dev environment, we will need to need to manually trigger the integraion tests on coding CI. To make sure the update version of `platform-cn` did not broke previous features.

- **Manually trigger tests here**: https://sftest11.coding.net/p/integration-test-cn/ci/job

`SERVERLESS_PLATFORM_STAGE=dev npm run test` will be run on codingCI

### PROD environment

Everytime after the deployment of `platform-cn`, the general integraion tests will be auto triggered (by calling coding CI's API).

- **You can see the tests results here**: https://sftest11.coding.net/p/integration-test-cn/ci/job?id=399367

`npm run test` will be ran and after that, all the templates will be tested (`npm run test-template express-starter`...)

```bash
curl -u token \
   -v -X POST 'https://sftest11.coding.net/api/cci/job/399367/trigger' \
   -H 'Content-Type: application/json' \
   -d '
    {
      "ref": "main",
      "envs": []
    }'
```

### Notes

- Sometimes the tests will fail because of network issues(for example while uploading `nextjs` template), and we will need to manually trigger integration tests again
- 
