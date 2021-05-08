/* eslint-disable max-classes-per-file */
const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { SocksProxyAgent } = require('socks-proxy-agent');

const { botHandlers } = require('./handlers/bot');

class Bot {
	constructor(config, statisticsRepo) {
		this.config = config;
		const socksAgent = new SocksProxyAgent({ port: 9050, host: '127.0.0.1' });
		this.bot = new Telegraf(
			config.botToken,
			config.useTorProxy === 'true'
				? { telegram: { agent: socksAgent } }
				: undefined,
		);
		this.bot.context.statisticsRepo = statisticsRepo;
		this.bot.use(
			rateLimit({
				window: 1000,
				limit: 3,
			}),
		);

		this.bot.use(botHandlers);
	}

	launchWithWebhook() {
		this.bot.telegram
			.setWebhook(
				`${this.config.baseUrl}/bot${this.config.webhookRouteToken}`,
				{
					allowed_updates: ['message', 'channel_post'],
				},
			)
			.then(() => {
				console.log('webhook was set');
			})
			.catch(console.error);

		return this.bot.webhookCallback(`/bot${this.config.webhookRouteToken}`);
	}

	launchWithPooling() {
		this.bot.launch();
	}

	getChatById(id) {
		return this.bot.telegram.getChat(id);
	}
}

module.exports = { Bot };
