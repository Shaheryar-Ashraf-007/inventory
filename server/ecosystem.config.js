const module ={
    apps: [
      {
        name: "inventory-management-system-server",
        script: "nodemon",
        args: "src/index.js",
        env: {
          NODE_ENV: "development",
          ENV_VAR1: "environment-variable",
        },
      },
    ],
  };
  export default module