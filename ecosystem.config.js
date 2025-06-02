module.exports = {
  apps: [
    {
      name: 'portfolio',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
      env_development: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
    },
  ],
}
