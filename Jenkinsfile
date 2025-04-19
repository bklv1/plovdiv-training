pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                    // Handle JUnit reports but allow the build to fail if tests fail
                    //TODO: Check why it is Junit
//                    junit testResults: 'test-results/junit-*.xml', allowEmptyResults: true
                }
            }
        }
    }
}
