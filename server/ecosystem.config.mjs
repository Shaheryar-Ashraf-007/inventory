export default {
  apps: [{
    name: "inventory-management",
    script: "/root/inventory/server/src/index.js",
    watch: true,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
}

