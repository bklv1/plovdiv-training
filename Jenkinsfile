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
                // Create test results directory if it doesn't exist
                sh 'mkdir -p test-results'
                
                // Run tests and allow the build to fail if tests fail
                sh '''
                    # Run tests and capture the exit code
                    npm run test
                    TEST_EXIT_CODE=$?
                    
                    # If no JUnit reports were generated, create a minimal one
                    if [ ! -f "test-results/junit-*.xml" ]; then
                        echo '<?xml version="1.0" encoding="UTF-8"?><testsuites><testsuite name="Placeholder" tests="1" errors="0" failures="1" skipped="0"><testcase classname="Placeholder" name="No tests run" time="0"><failure message="Test execution failed or no tests were executed">Tests failed with exit code ${TEST_EXIT_CODE}</failure></testcase></testsuite></testsuites>' > test-results/junit-placeholder.xml
                    fi
                    
                    # Exit with the original test exit code to fail the build if tests failed
                    exit $TEST_EXIT_CODE
                '''
            }
            post {
                always {
                    // Archive test results and reports
                    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                    
                    // Handle JUnit reports but allow the build to fail if tests fail
                    junit testResults: 'test-results/junit-*.xml', allowEmptyResults: true
                }
            }
        }
    }
    
    post {
        always {
            // Archive the entire playwright-report directory for local download
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            
            echo "Test execution completed. Reports are available for download from the Jenkins artifacts."
            echo "You can download the report files from the Jenkins web interface."
        }
    }
}
