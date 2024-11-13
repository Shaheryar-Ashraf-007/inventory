export default {
  apps: [
    {
      name: "inventory-management-system-server",
      script: "index.js", // Relative path to index.js
      interpreter: "node",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment-variable",
      },
    },
  ],
};