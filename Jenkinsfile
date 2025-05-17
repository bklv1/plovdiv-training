pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {
        stage('Install Dependencies'){
            steps{
                sh 'npm install'
            }
        }
        stage('Run Tests'){
            steps{
                sh 'npm run test'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                    junit testResults: 'test-results/junit-*.xml', allowEmptyResults: true
                }
                success {
                    echo 'All the tests have passed'
                }
                failure {
                    echo 'Some tests have failed'
                }
            }
        }
    }
}
