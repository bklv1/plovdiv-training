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
                // Use explicit checkout instead of 'checkout scm'
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/master']], // Use master branch
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    submoduleCfg: [],
                    userRemoteConfigs: [[
                        url: 'https://github.com/bklv1/plovdiv-training.git'
                    ]]
                ])
            }
        }
        
        stage('Setup') {
            steps {
                // Create directories for test results
                bat 'mkdir %PLAYWRIGHT_HTML_REPORT% 2>nul || echo Directory already exists'
                bat 'mkdir %TEST_RESULTS_DIR% 2>nul || echo Directory already exists'
                
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
                            junit allowEmptyResults: true, testResults: "${TEST_RESULTS_DIR}/**/*.xml"
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
                            junit allowEmptyResults: true, testResults: "${TEST_RESULTS_DIR}/**/*.xml"
                        }
                    }
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
    }
}
