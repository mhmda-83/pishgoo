process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const { getConfigs } = require('./configs');

const configs = getConfigs();

const messages = require('./messages');

const getMessageRes = require('./getMessageRes');

const bot = new TelegramBot(
	configs.botToken,
	configs.isProduction
		? { polling: false }
		: {
				polling: true,
				request: { proxy: 'http://127.0.0.1:8118', url: 'http://google.com' },
		  }
);

// eslint-disable-next-line consistent-return
bot.on('message', (message) => {
	if (message?.text === '/start') {
		return bot.sendMessage(message.chat.id, messages.welcome, {
			reply_to_message_id: message.message_id,
			parse_mode: 'HTML',
		});
	}

	if (!message.dice) return undefined;
	const { emoji, value } = message.dice;

	bot.sendMessage(message.chat.id, getMessageRes(emoji, value), {
		reply_to_message_id: message.message_id,
	});
});

module.exports = bot;
