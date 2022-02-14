const deathCauseEasterEggHandler = (ctx) =>
	ctx.replyWithVideo(
		'BAACAgQAAxkBAAIBT2IKGlhWsiwEVJple9ZftgPGlKz7AAJRDAACz-spU6QeTbVL7HX2IwQ',
		{
			reply_to_message_id: ctx.message.message_id,
		},
	);

module.exports = { deathCauseEasterEggHandler };
