pipeline {
    agent any
    
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
                // Use specific checkout options to avoid EditDistance errors
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    extensions: [[$class: 'CleanBeforeCheckout']],
                    userRemoteConfigs: [[url: scm.userRemoteConfigs[0].url]]
                ])
            }
        }
        
        stage('Setup') {
            steps {
                // Create directories for test results with simpler commands
                bat 'if not exist %PLAYWRIGHT_HTML_REPORT% mkdir %PLAYWRIGHT_HTML_REPORT%'
                bat 'if not exist %TEST_RESULTS_DIR% mkdir %TEST_RESULTS_DIR%'
                
                // Install dependencies
                bat 'npm ci'
                bat 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            steps {
                // Run tests with additional parameters for stability
                bat 'npx playwright test --reporter=html,junit --retries=1 --timeout=60000'
            }
            post {
                always {
                    // Archive test artifacts
                    archiveArtifacts artifacts: "playwright-report/**", allowEmptyArchive: true
                    junit testResults: "test-results/**/*.xml", allowEmptyResults: true
                }
            }
        }
    }
    
    post {
        always {
            // Send email with test results
            emailext (
                subject: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                body: """<p>${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
                <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>
                <p>Test Summary: ${currentBuild.currentResult}</p>
                <p>See detailed test results at: <a href='${env.BUILD_URL}testReport'>${env.JOB_NAME} [${env.BUILD_NUMBER}] Test Results</a></p>""",
                to: "${EMAIL_RECIPIENTS}",
                attachmentsPattern: "playwright-report/**/*.html",
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
    }
}
