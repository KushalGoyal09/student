function getEnvVariable(key: string) {
    const value = process.env[key];
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}

const Secret = {
    PORT: getEnvVariable('PORT')
};

export default Secret;
