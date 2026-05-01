pipeline {
    agent { 
        label 'docker-agent' // This uses the agent we just fixed!
    }

    environment {
        // Define your app name and version
        APP_NAME = "rubiks-ui-app"
        IMAGE_NAME = "local-registry/${APP_NAME}:${env.BUILD_ID}"
    }

    stages {
        stage('Cleanup') {
            steps {
                echo 'Cleaning up old containers...'
                // Remove the old container if it exists to free up the port
                sh "docker rm -f ${APP_NAME} || true"
            }
        }

        stage('Build Image') {
            steps {
                echo "Building image: ${IMAGE_NAME}"
                // This builds the Dockerfile located in your repo
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Deploy') {
            steps {
                echo "Starting the new container..."
                // Runs the newly built image on the DinD engine
                sh "docker run -d --name ${APP_NAME} -p 9000:80 ${IMAGE_NAME}"
            }
        }

        stage('Verify') {
            steps {
                echo "Checking if container is running..."
                sh "docker ps | grep ${APP_NAME}"
            }
        }
    }

    post {
        failure {
            echo "Pipeline failed. Check the logs above."
        }
    }
}
