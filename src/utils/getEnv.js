const getEnv = (name, defaultValue) => {
	const value = process.env[name];
	if (value != null) return value;
	if (defaultValue != null) return defaultValue;
	throw new Error(`Environment ${name} is required.`);
};

module.exports = getEnv;
