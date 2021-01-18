const getEnv = (name, defaultValue) => {
	const value = process.env[name];
	if (value != null) return value;
	if (defaultValue != null) return defaultValue;
	throw new Error(`Environment ${name} is required.`);
};

exports.getConfigs = () => ({
	botToken: getEnv('BOT_TOKEN'),
	port: getEnv('PORT', 3000),
	isProduction: getEnv('NODE_ENV') === 'production',
	dbUrl: getEnv('DB_URL'),
	token: getEnv('TOKEN'),
	baseUrl: getEnv('BASE_URL'),
});
