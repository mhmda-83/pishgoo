const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { SocksProxyAgent } = require('socks-proxy-agent');

const { botHandlers } = require('./handlers/bot');

const createBot = ({ config }) => {
	const socksAgent = new SocksProxyAgent({ port: 9050, host: '127.0.0.1' });
	const bot = new Telegraf(
		config.botToken,
		config.useTorProxy === 'true'
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

function launchBot({ bot, config }) {
	if (config.isProduction)
		bot.telegram
			.setWebhook(`${config.baseUrl}/bot${config.webhookRouteToken}`, {
				allowed_updates: ['message', 'channel_post'],
			})
			.then(() => {
				console.log('webhook was set');
			})
			.catch(console.error);
	if (!config.isProduction) bot.launch();
}

module.exports = { createBot, launchBot };
