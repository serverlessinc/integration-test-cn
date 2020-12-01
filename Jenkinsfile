pipeline {
  agent any
  stages {
    stage('check out') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: env.GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: env.GIT_REPO_URL,
            credentialsId: env.CREDENTIALS_ID
          ]]])
        }
      }
      stage('integration test') {
        steps {
          sh 'npm install serverless'
          sh 'npm install'
          sh 'npm test'
        }
      }
    }
  }