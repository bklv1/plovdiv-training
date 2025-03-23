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
            checkout scm
        }
    }

    stage('Setup') {
        steps {
            // Create directories for test results with simpler commands
            sh 'mkdir -p $PLAYWRIGHT_HTML_REPORT'
            sh 'mkdir -p $TEST_RESULTS_DIR'

            // Install dependencies
            sh 'if [ -f package-lock.json ]; then npm ci; else npm install; fi'
            sh 'npx playwright install --with-deps'
        }
    }

    stage('Run Tests') {
        steps {
            // Run tests with additional parameters for stability
            sh 'npx playwright test --reporter=html,junit --retries=1 --timeout=60000'
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
          emailext body: "Build ${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}",
                   subject: "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}",
                   to: "${EMAIL_RECIPIENTS}"
      }
      success {
          echo 'All tests passed!'
      }
      failure {
          echo 'Tests failed!'
      }
  }
}
