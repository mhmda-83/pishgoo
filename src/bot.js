process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const { getConfigs } = require('./configs');

const configs = getConfigs();

const messages = require('./messages');

let bot;
if (configs.isProduction) {
	bot = new TelegramBot(configs.botToken, { polling: false });
} else {
	bot = new TelegramBot(configs.botToken, {
		polling: true,
		request: { proxy: 'http://127.0.0.1:8118', url: 'http://google.com' },
	});
}

// eslint-disable-next-line consistent-return
bot.on('message', (message) => {
	if (message?.text === '/start') {
		return bot.sendMessage(message.chat.id, messages.welcome, {
			reply_to_message_id: message.message_id,
			parse_mode: 'HTML',
		});
	}

	const diceData = message.dice;
	if (!diceData) return undefined;
	const { emoji, value } = diceData;
	if (emoji === '🏀') {
		bot.sendMessage(message.chat.id, messages.basketballResponses[value - 1], {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '🎲') {
		bot.sendMessage(message.chat.id, `عدد ${value}.`, {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '🎯') {
		bot.sendMessage(message.chat.id, messages.dartResponses[value - 1], {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '⚽') {
		bot.sendMessage(message.chat.id, messages.footballResponses[value - 1], {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '🎰') {
		// 1 = triple bar
		// 22 = triple grape
		// 43 = triple lemon
		// 64 = triple seven
		const numbers = [1, 22, 43, 64];

		if (numbers.includes(value)) {
			bot.sendMessage(
				message.chat.id,
				messages.doubleTripleChance.successfull,
				{
					reply_to_message_id: message.message_id,
				}
			);
		} else {
			bot.sendMessage(
				message.chat.id,
				messages.doubleTripleChance.unsuccessful,
				{
					reply_to_message_id: message.message_id,
				}
			);
		}
	} else {
		bot.sendMessage(message.chat.id, value, {
			reply_to_message_id: message.message_id,
		});
	}
});

module.exports = bot;
