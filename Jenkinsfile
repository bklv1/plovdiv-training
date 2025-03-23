pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // Use the NodeJS installation configured in Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests in Parallel') {
            parallel {
                stage('Login Tests') {
                    steps {
                        bat 'npx playwright test tests/login.spec.ts --reporter=html'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                        }
                    }
                }
                
                stage('Dashboard Tests') {
                    steps {
                        bat 'npx playwright test tests/dashboard.spec.ts --reporter=html'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'All tests passed!'
        }
        failure {
            echo 'Tests failed!'
        }
    }
}
