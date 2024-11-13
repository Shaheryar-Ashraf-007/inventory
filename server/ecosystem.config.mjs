export default {
  apps: [{
    name: "inventory-management-system-server",
    script: "./src/index.js",  // or your main server file path
    watch: true,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
}