pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    options {
        timeout(time: 30, unit: 'MINUTES')
        ansiColor('xterm')
    }
    
    stages {
        stage('Setup') {
            steps {
                echo "Node.js version:"
                sh 'node --version'
                echo "NPM version:"
                sh 'npm --version'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
                sh 'npx playwright install chromium || echo "Chromium installation failed but continuing"'
                sh 'npx playwright install-deps chromium || echo "Dependencies installation failed but continuing"'
            }
        }
    
        stage('Run Tests') {
            steps {
                sh 'npm run test'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
                }
                failure {
                    echo 'Tests failed! Check the archived reports for details.'
                }
                success {
                    echo 'All tests passed successfully!'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
        }
        failure {
            echo 'Pipeline failed'
        }
        success {
            echo 'Pipeline succeeded'
        }
    }
}
