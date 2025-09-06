pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/var/www/html"
        FRONTEND_DIR = "acre-flow-crm"
        BACKEND_DIR = "crm-backend"
    }

    stages {

        stage('📥 Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/web100Acress/CRM-100acress.git'
            }
        }

        // FRONTEND BUILD & DEPLOY
        stage('📦 Install Frontend Dependencies') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        rm -rf node_modules package-lock.json
                        npm install
                    '''
                }
            }
        }

        stage('🏗️ Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        npm run build
                    '''
                }
            }
        }

        stage('🚀 Deploy Frontend to Nginx') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        if [ -d "$DEPLOY_DIR" ]; then
                          sudo rm -rf $DEPLOY_DIR/*
                        else
                          sudo mkdir -p $DEPLOY_DIR
                        fi

                        sudo cp -r dist/* $DEPLOY_DIR/
                        sudo chown -R jenkins:jenkins $DEPLOY_DIR
                        sudo chmod -R 755 $DEPLOY_DIR
                    '''
                }
            }
        }

        // BACKEND SETUP & RUN
        stage('📦 Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh '''
                        rm -rf node_modules package-lock.json
                        npm install
                    '''
                }
            }
        }

        stage('🚀 Run Backend via PM2') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh '''
                        pm2 delete crm-backend || true
                        pm2 start src/server.js --name crm-backend
                        pm2 save
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ CRM Frontend & Backend deployed!"
        }
        failure {
            echo "❌ Something went wrong during deployment."
        }
    }
}
