function getEnvVariable(key: string) {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}

const Secret = {
    PORT: getEnvVariable('PORT'),
    SECRET: getEnvVariable('SECRET'),
    DATABASE_URL: getEnvVariable('DATABASE_URL')
};

export default Secret;
