export default {
  apps: [
    {
      name: "inventory-management-system-server",
      script: "server/src/index.js", // Path to your entry file
      interpreter: "node",
      env: {
        NODE_ENV: "development",
        ENV_VAR1: "environment-variable",
      },
    },
  ],
};