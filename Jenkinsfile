pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // Use the NodeJS installation configured in Jenkins
    }
    
    // Define email recipients
//     environment {
//         EMAIL_RECIPIENTS = 'ceco@mailinator.com' // Change to your email or distribution list
//     }
    
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
                        bat 'npx playwright test tests/login.spec.ts --reporter=html,junit'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                            junit 'test-results/login-*.xml'
                        }
                    }
                }
                
                stage('Dashboard Tests') {
                    steps {
                        bat 'npx playwright test tests/dashboard.spec.ts --reporter=html,junit'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                            junit 'test-results/dashboard-*.xml'
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Generate combined test report
//             junit '**/test-results/*.xml'
//
//             // Send email with test results
//             emailext (
//                 subject: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
//                 body: """<p>${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
//                 <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>
//                 <p>Test Summary: ${currentBuild.currentResult}</p>
//                 <p>See detailed test results at: <a href='${env.BUILD_URL}testReport'>${env.JOB_NAME} [${env.BUILD_NUMBER}] Test Results</a></p>""",
//                 to: "${EMAIL_RECIPIENTS}",
//                 attachmentsPattern: 'playwright-report/**/*.html',
//                 mimeType: 'text/html',
//                 attachLog: true
//             )
            
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
