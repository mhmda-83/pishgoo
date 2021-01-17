module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: ['airbnb-base', 'prettier'],
	parserOptions: {
		ecmaVersion: 12,
	},
	rules: {
		indent: 'off',
		'no-tabs': 0,
		'no-console': 0,
	},
};
