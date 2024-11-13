export default {
    apps: [
      {
        name: "inventory-management-system-server",
        script: "node src/index.js",
        env: {
          NODE_ENV: "development",
          ENV_VAR1: "environment-variable",
        },
      },
    ],
  };