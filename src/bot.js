const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { SocksProxyAgent } = require('socks-proxy-agent');

const Statistics = require('./models/statistics');

const messages = require('./data/messages');

const getMessageRes = require('./utils/getMessageRes');
const randomRangeNumber = require('./utils/randomRangeNumber');
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

	bot.hears(/when am i (going to|gonna) (die|bite the dust)/i, (ctx) => {
		const probability = randomRangeNumber(1, 6);
		if (probability === 1) {
			ctx.reply('soon 🤯', {
				reply_to_message_id: ctx.message.message_id,
			});
		} else if (probability === 2) {
			ctx.replyWithPhoto('https://ibb.co/sJk4mx6', {
				reply_to_message_id: ctx.message.message_id,
			});
		} else if (probability === 3) {
			ctx.replyWithPhoto('https://ibb.co/7N85wq7', {
				reply_to_message_id: ctx.message.message_id,
				caption: "death is currently having a good time\ndon't ruin it for him",
			});
		} else if (probability === 4) {
			ctx.replyWithPhoto('https://ibb.co/nfY2fRS', {
				reply_to_message_id: ctx.message.message_id,
			});
		} else {
			ctx.reply(
				'<pre language="javascript">> Uncaught TypeError: God.getDeathDateOf is not a function</pre>',
				{
					reply_to_message_id: ctx.message.message_id,
					parse_mode: 'HTML',
				},
			);
		}
	});

	bot.hears(/when does quarantine over/i, (ctx) => {
		const probability = randomRangeNumber(1, 4);
		if (probability === 1)
			ctx.replyWithPhoto('https://ibb.co/5rnffMj', {
				reply_to_message_id: ctx.message.message_id,
			});
		else if (probability === 2)
			ctx.replyWithPhoto('https://ibb.co/Sstv46N', {
				reply_to_message_id: ctx.message.message_id,
			});
		else
			ctx.replyWithPhoto('https://ibb.co/m4NKS8B', {
				reply_to_message_id: ctx.message.message_id,
			});
	});

	bot.on('channel_post', (ctx) => {
		if (!ctx.channelPost.dice) return;

		const { emoji, value } = ctx.channelPost.dice;

		Statistics.create({
			chat: {
				id: ctx.senderChat.id,
			},
		});

		ctx.reply(getMessageRes(emoji, value), {
			reply_to_message_id: ctx.channelPost.message_id,
		});
	});

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
