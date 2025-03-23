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
                // Simple checkout to avoid EditDistance errors
                checkout scm
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
                // Run all tests in a single command to avoid parallel issues
                bat 'npx playwright test --reporter=html,junit'
            }
            post {
                always {
                    archiveArtifacts artifacts: "playwright-report/**", allowEmptyArchive: true
                    junit "test-results/**/*.xml"
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
