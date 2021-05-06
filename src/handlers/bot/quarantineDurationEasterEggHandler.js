const randomRangeNumber = require('../../utils/randomRangeNumber');

const quarantineDurationEasterEggHandler = (ctx) => {
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
};

module.exports = { quarantineDurationEasterEggHandler };
