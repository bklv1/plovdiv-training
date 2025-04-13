pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps chromium'
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
                    junit testResults: 'test-results/junit-*.xml', allowEmptyResults: true
                }
            }
        }
    }
}
