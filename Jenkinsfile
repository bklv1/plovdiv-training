pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'sudo npx playwright install-deps'
            }
        }

        stage('Run Tests') {
            steps {
                // Create test results directory if it doesn't exist
                sh 'mkdir -p test-results'

                // Run tests only on Chromium and in parallel with more workers
                sh '''
                    npm run test

                '''
            }
            post {
                always {
                    // Archive test results and reports
                    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
//
//                     // Handle JUnit reports but allow the build to fail if tests fail
//                     junit testResults: 'test-results/junit-*.xml', allowEmptyResults: true
                }
            }
        }
    }
}
