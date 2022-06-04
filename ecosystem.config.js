module.exports = {
  apps : [
    {
      name: "Streaming-manager Frontend",
      script: "yarn run frontend",
      watch: true,
      env: {
        NEXT_PUBLIC_BACKEND_PORT: (process.env?.BACKEND_PORT && process.env.BACKEND_PORT.length) ? process.env.BACKEND_PORT : 6000,
        NEXT_PUBLIC_BACKEND_HOST: (process.env?.BACKEND_HOST && process.env.BACKEND_HOST.length) ? process.env.BACKEND_HOST : "localhost"
      }
    },
    {
      name: "Streaming-manager backend",
      script: "yarn run backend --env=.env",
      watch: true
    },
    {
      name: "Streaming-manager backend worker",
      script: "yarn run background --env=.env",
      watch: false
    }
  ]
}