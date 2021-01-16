// get rid of NodeTelegramBotApi deprecation warning
process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');

const { getConfigs } = require('./configs');
const Statistics = require('./models/statistics');

const configs = getConfigs();

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
		const text = `سلام سلام، خوش اومدی 👋

یکی از ایموجیای ⚽️ 🏀🎰🎯🎲 رو برام بفرست تا معجزه رو ببینی 😉

حواست باشه تلگرامت آپدیت باشه ⚠️

<a href="https://github.com/mhmda-83/pishgoo/">ریپازیتوری گیتهاب پروژه</a>`;
		return bot.sendMessage(message.chat.id, text, {
			reply_to_message_id: message.message_id,
			parse_mode: 'HTML',
		});
	}

	const diceData = message.dice;
	if (!diceData) return undefined;

	if (message.from?.id) {
		Statistics.create({
			userId: message.from.id,
			chat: {
				id: message.chat.id,
				type: message.chat.type,
				title: message.chat.title,
			},
		});
	}

	const basketballResponses = [
		'میخوره به قسمت بالایی سبد و میره بیرون.',
		'دور سبد می‌چرخه و در نهایت میره بیرون.',
		'گوشه سبد گیر می‌کنه.',
		'دور سبد می‌چرخه و در نهایت میره داخلش.',
		'مستقیم میره توی سبد.',
	];
	const dartResponses = [
		'بیرون.',
		'آخرین قسمت از داخل.',
		'چهارمین قسمت از داخل',
		'سومین قسمت از داخل.',
		'دومین قسمت از داخل.',
		'وسط.',
	];
	const footballResponses = [
		'با کات میره بیرون.',
		'به تیرک سمت راست دروازه برخورد می‌کنه.',
		'با کات وسط دروازه.',
		'با کات سمت چپ پایین، توی دروازه.',
		'گوشه بالا سمت راست، توی دروازه.',
	];
	const { emoji, value } = diceData;
	if (emoji === '🏀') {
		bot.sendMessage(message.chat.id, basketballResponses[value - 1], {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '🎲') {
		bot.sendMessage(message.chat.id, `عدد ${value}.`, {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '🎯') {
		bot.sendMessage(message.chat.id, dartResponses[value - 1], {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '⚽') {
		bot.sendMessage(message.chat.id, footballResponses[value - 1], {
			reply_to_message_id: message.message_id,
		});
	} else if (emoji === '🎰') {
		// 1 = triple bar
		// 22 = triple grape
		// 43 = triple lemon
		// 64 = triple seven
		const numbers = [1, 22, 43, 64];

		if (numbers.includes(value)) {
			bot.sendMessage(message.chat.id, 'جور میشه.', {
				reply_to_message_id: message.message_id,
			});
		} else {
			bot.sendMessage(message.chat.id, 'جور نمیشه.', {
				reply_to_message_id: message.message_id,
			});
		}
	} else {
		bot.sendMessage(message.chat.id, value, {
			reply_to_message_id: message.message_id,
		});
	}
});

module.exports = bot;
