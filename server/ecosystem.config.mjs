module.exports = {
  apps: [{
    name: "inventory-management-system-server",
    script: "./src/index.js",  // Ensure this path is correct relative to the ecosystem file
    watch: true,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
}
