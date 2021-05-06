const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { SocksProxyAgent } = require('socks-proxy-agent');

const Statistics = require('./models/statistics');

const messages = require('./data/messages');

const getMessageRes = require('./utils/getMessageRes');
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

	bot.on('message', (ctx) => {
		if (!ctx.message.dice && ctx.chat.type === 'private')
			ctx.reply(messages.unknown, {
				reply_to_message_id: ctx.message.message_id,
			});
		if (!ctx.message.dice) return;

		const { emoji, value } = ctx.message.dice;

		if (ctx.from.id) {
			Statistics.create({
				userId: ctx.from.id,
				chat: {
					id: ctx.chat.id,
				},
			});
		}

		ctx.reply(getMessageRes(emoji, value), {
			reply_to_message_id: ctx.message.message_id,
		});
	});

	return bot;
};
module.exports = createBot;
