const getMessageRes = require('../../utils/getMessageRes');
const messages = require('../../data/messages');

const onMessageHandler = (ctx) => {
	if (!ctx.message.dice && ctx.chat.type === 'private')
		ctx.reply(messages.unknown, {
			reply_to_message_id: ctx.message.message_id,
		});
	if (!ctx.message.dice) return;

	const { emoji, value } = ctx.message.dice;

	if (ctx.from.id) {
		ctx.statisticsRepo.create({
			userId: ctx.from.id,
			chat: {
				id: ctx.chat.id,
			},
		});
	}

	ctx.reply(getMessageRes(emoji, value), {
		reply_to_message_id: ctx.message.message_id,
	});
};
module.exports = { onMessageHandler };
