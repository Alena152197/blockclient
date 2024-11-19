module.exports = {
    apps: [
        {
            name: "client-dev",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development"
            }
        },
        {
            name: "client-prod",
            script: "npm",
            args: "run start",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
}