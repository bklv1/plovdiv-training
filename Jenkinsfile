pipeline {
    agent any
    
//     tools {
//         nodejs 'NodeJS' // Use the NodeJS installation configured in Jenkins
//     }
    
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
        }
	}
}
