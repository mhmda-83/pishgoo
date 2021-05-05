const messages = require('../../data/messages');

const startHandler = (ctx) => {
	ctx.reply(messages.welcome, {
		reply_to_message_id: ctx.message.message_id,
		parse_mode: 'HTML',
	});
};

module.exports = { startHandler };
