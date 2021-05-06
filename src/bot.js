const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { SocksProxyAgent } = require('socks-proxy-agent');

const { botHandlers } = require('./handlers/bot');

const createBot = (configs) => {
	const socksAgent = new SocksProxyAgent({ port: 9050, host: '127.0.0.1' });
	const bot = new Telegraf(
		configs.botToken,
		configs.useTorProxy === 'true'
			? { telegram: { agent: socksAgent } }
			: undefined,
	);

	bot.use(
		rateLimit({
			window: 1000,
			limit: 3,
		}),
	);

	bot.use(botHandlers);

	return bot;
};
module.exports = createBot;
