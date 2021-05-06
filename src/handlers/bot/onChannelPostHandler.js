const getMessageRes = require('../../utils/getMessageRes');
const Statistics = require('../../models/statistics');

const onChannelPostHandler = (ctx) => {
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
};
module.exports = { onChannelPostHandler };
