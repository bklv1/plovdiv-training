pipeline {
    agent any
    
    options {
        // Disable lightweight checkout to avoid issues
        skipDefaultCheckout(true)
    }
    
    tools {
        nodejs 'NodeJS' // Use the NodeJS installation configured in Jenkins
    }
    
    // Define email recipients
    environment {
        EMAIL_RECIPIENTS = 'ceco@mailinator.com' // Change to your email or distribution list
        PLAYWRIGHT_HTML_REPORT = 'playwright-report'
        TEST_RESULTS_DIR = 'test-results'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Force full checkout
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']], // Adjust branch as needed
                    extensions: [[$class: 'CleanBeforeCheckout']],
                    userRemoteConfigs: scm.userRemoteConfigs
                ])
            }
        }
        
        stage('Setup') {
            steps {
                // Create directories for test results
                bat 'if not exist %PLAYWRIGHT_HTML_REPORT% mkdir %PLAYWRIGHT_HTML_REPORT%'
                bat 'if not exist %TEST_RESULTS_DIR% mkdir %TEST_RESULTS_DIR%'
                
                // Install dependencies
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
                            archiveArtifacts artifacts: "${PLAYWRIGHT_HTML_REPORT}/**", allowEmptyArchive: true
                            junit testResults: "${TEST_RESULTS_DIR}/**/*.xml", allowEmptyResults: true
                        }
                    }
                }
                
                stage('Dashboard Tests') {
                    steps {
                        bat 'npx playwright test tests/dashboard.spec.ts --reporter=html,junit'
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: "${PLAYWRIGHT_HTML_REPORT}/**", allowEmptyArchive: true
                            junit testResults: "${TEST_RESULTS_DIR}/**/*.xml", allowEmptyResults: true
                        }
                    }
                }
            }
        }
        
        stage('Generate Combined Report') {
            steps {
                // Merge reports if needed
                bat 'npx playwright merge-reports %PLAYWRIGHT_HTML_REPORT%'
            }
        }
    }
    
    post {
        always {
            // Generate combined test report
            junit testResults: "${TEST_RESULTS_DIR}/**/*.xml", allowEmptyResults: true

            // Send email with test results
            emailext (
                subject: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>
                <p>Test Summary: ${currentBuild.currentResult}</p>
                <p>See detailed test results at: <a href='${env.BUILD_URL}testReport'>${env.JOB_NAME} [${env.BUILD_NUMBER}] Test Results</a></p>""",
                to: "${EMAIL_RECIPIENTS}",
                attachmentsPattern: "${PLAYWRIGHT_HTML_REPORT}/**/*.html",
                mimeType: 'text/html',
                attachLog: true
            )
        }
        success {
            echo 'All tests passed!'
        }
        failure {
            echo 'Tests failed!'
        }
        cleanup {
            // Clean up workspace
            cleanWs()
        }
    }
}
