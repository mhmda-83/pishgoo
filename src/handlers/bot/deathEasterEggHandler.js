const randomRangeNumber = require('../../utils/randomRangeNumber');

const deathEasterEggHandler = (ctx) => {
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
};
module.exports = { deathEasterEggHandler };
