module.exports = {
  apps: [{
    name: "inventory-management-system-server",
    script: "./src/index.js", // Path to your script file
    watch: true,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
}
