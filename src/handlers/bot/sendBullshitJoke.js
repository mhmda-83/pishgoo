const axios = require('axios');

const sendBullshitJoke = async (ctx) => {
	try {
		if (Math.random() > 0.5)
			return ctx.reply('نمیفرستم فشار بخور', {
				reply_to_message_id: ctx.message.message_id,
			});
		const { data } = await axios.get('https://api.codebazan.ir/jok/json/');

		const joke = data.result.jok;
		return ctx.reply(joke.trim(), {
			reply_to_message_id: ctx.message.message_id,
		});
	} catch (err) {
		console.log('error', err);
		return ctx.reply('نمیفرستم فشار بخور', {
			reply_to_message_id: ctx.message.message_id,
		});
	}
};

module.exports = { sendBullshitJoke };
