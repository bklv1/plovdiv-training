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
            }
            post {
                always {
                    // Archive test results and reports
                    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                    junit 'test-results/junit-*.xml'
                }
            }
        }
    }
    
    post {
        always {
            // Send email with test results
            emailext (
                subject: "Test Report: ${currentBuild.fullDisplayName}",
                body: """
                    <p>Build Status: ${currentBuild.result}</p>
                    <p>Build URL: ${env.BUILD_URL}</p>
                    <p>Test Summary: ${currentBuild.result == 'SUCCESS' ? 'All tests passed' : 'Some tests failed'}</p>
                    <p>See attached test report for details.</p>
                """,
                to: 'ceco@mailnator.com, cvetomirbanovski@gmail.com',
                attachmentsPattern: 'playwright-report/**/*.html',
                mimeType: 'text/html',
                // Removed DevelopersRecipientProvider to avoid unregistered user errors
                recipientProviders: [[$class: 'RequesterRecipientProvider']]
            )
        }
    }
}
