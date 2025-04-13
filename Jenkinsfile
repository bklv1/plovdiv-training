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
                sh '''
                apt-get update
                apt-get install libglib2.0-0 libnss3 libnspr4 libdbus-1-3 libatk1.0-0 libatk-bridge2.0-0 libatspi2.0-0 libx11-6 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 libgbm1 libxcb1 libxkbcommon0                             libasound2
                '''
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
