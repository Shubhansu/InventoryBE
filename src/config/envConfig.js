const config = {
    "dev": {
        "mySQLDB": {
            "url": "....",
            "username": "....",
            "password": "....."
        },
        "jwt": {
            "secret": 'K?+9("dOmzp{nNs+UQy^18g}~$q]+R',
            "expiresIn": "2 days",
            "issuer": "inventory"
        }
    }
    
}

const configuration = config[process.env.Inv_ENV] || config.dev;

module.exports = configuration;