/* eslint-disable no-undef */
const crypto = require('crypto');
const createPredictionQuoteRes = require('./createPredictionQuoteRes');
const getEnv = require('./getEnv');

describe('#utilTest ', () => {
	test('#createPredictionQuoteRes', () => {
		// generate random text with random len(1-128) chars and repeat it for 128 times.
		// eslint-disable-next-line no-plusplus
		for (let index = 0; index < 128; index++) {
			const text = crypto.randomBytes(Math.random(128) + 1).toString('hex');
			const author = crypto.randomBytes(Math.random(128) + 1).toString('hex');
			expect(createPredictionQuoteRes({ text, author })).toMatch(
				`${text}\n\n\n –${author}`,
			);
		}
	});
	test('#getEnv', () => {
		// if can't find any env variable matching the required name should return default value .
		expect(getEnv('TEST', 'TEST_VALUE')).toMatch(`TEST_VALUE`);
		// if there be a variable matching the required name , should return variable .
		process.env.TEST = 'ENV_TEST_VALUE';
		expect(getEnv('TEST', 'TEST_VALUE')).toMatch(`ENV_TEST_VALUE`);
	});
});
