const config = Object.freeze({
    DB_HOST: process.env.DB_HOST,
    PORT: Number(process.env.PORT) || 3000,
    ADMIN_AUTH_KEY: process.env.ADMIN_AUTH_KEY,
    TMDB_API_KEY: process.env.TMDB_API_KEY
});

function validateConfig(requiredKeys = []) {
    const missingKeys = requiredKeys.filter((key) => !config[key]);

    if (missingKeys.length > 0) {
        throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
    }
}

module.exports = { ...config, validateConfig };
