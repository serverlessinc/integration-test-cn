> Coding mirror: https://sftest11.coding.net/public/integration-test-cn/integration-test-cn/git/files (auto synced every day)
> Runs on coding CI: https://sftest11.coding.net/p/integration-test-cn/ci/job

## About

- Integration tests are stored in the `test` folder.
- This repo will be synced to coding.net every day.
- The Jenkinsfile is used for CI on coding.net

## Usage

### Locally

```bash
# create a .env file and fill it with secret key
touch .env

# install latest serverless framework (used to test)
npm i serverless -g

# install local dependencies
npm i

# run tests
npm test
```

### Trigger on coding CI

```bash
curl -u pt20oxxgsiyc:001cc717496aa8fad85389906aa8a9c152b94db0 \
   -v -X POST  'https://sftest11.coding.net/api/cci/job/399367/trigger' \
   -H 'Content-Type: application/json' \
   -d '
    {
    "ref": "main",
    "envs": []
}'
```

> Note: the link will expire in 2021-12-01
