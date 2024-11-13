export default {
    apps: [
      {
        name: "inventory-management-system-server",
        script: "npm",
        args: "src/index.js",
        env: {
          NODE_ENV: "development",
          ENV_VAR1: "environment-variable",
        },
      },
    ],
  };