module.exports = {
  apps: [
    {
      name: 'crm-backend',
      script: './crm-backend/src/server.js',
      cwd: '/var/www/crm',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      }
    },
    {
      name: 'crm-frontend',
      script: 'serve',
      cwd: '/var/www/crm/acre-flow-crm',
      args: '-s dist -l 4173',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M'
    }
  ]
};
