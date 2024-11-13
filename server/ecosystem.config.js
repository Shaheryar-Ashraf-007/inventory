export default {
    apps: [
      {
        name: "inventory-management-system-server",
        script: "src/index.js",
        interpreter: "nodemon", // Use nodemon if desired


        env: {
          NODE_ENV: "development",
          ENV_VAR1: "environment-variable",
        },
      },
    ],
  };