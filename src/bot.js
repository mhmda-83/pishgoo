const { Telegraf } = require('telegraf');
const rateLimit = require('telegraf-ratelimit');
const { SocksProxyAgent } = require('socks-proxy-agent');

const { getConfigs } = require('./configs');
const Statistics = require('./models/statistics');

const configs = getConfigs();

const messages = require('./data/messages');

const getMessageRes = require('./utils/getMessageRes');
const { QuoteApi } = require('./services/quoteApi');
const createPredictionQuoteRes = require('./utils/createPredictionQuoteRes');
const randomRangeNumber = require('./utils/randomRangeNumber');

let bot;
if (configs.useTorProxy === 'true') {
	const socksAgent = new SocksProxyAgent({ port: 9050, host: '127.0.0.1' });
	bot = new Telegraf(configs.botToken, { telegram: { agent: socksAgent } });
} else {
	bot = new Telegraf(configs.botToken);
}

bot.use(
	rateLimit({
		window: 1000,
		limit: 3,
	}),
);

bot.start((ctx) => {
	ctx.reply(messages.welcome, {
		reply_to_message_id: ctx.message.message_id,
		parse_mode: 'HTML',
	});
});

bot.command('predict', async (ctx) => {
	const quoteData = await QuoteApi.getRandomQuote('future-prediction');
	ctx.reply(createPredictionQuoteRes(quoteData), {
		reply_to_message_id: ctx.message.message_id,
	});
});

bot.hears(/when am i (going to|gonna) die/i, (ctx) => {
	const probability = randomRangeNumber(1, 101);
	if (probability >= 25) {
		ctx.reply('soon 🤯', {
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

bot.on('message', (ctx) => {
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

module.exports = bot;
