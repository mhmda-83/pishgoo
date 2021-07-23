/* eslint-disable no-underscore-dangle */ const setWebhookHandler = ({
	bot,
	config,
}) => async (req, res) => {
	if (req.query.token !== config.setWebhookToken) return res.sendStatus(403);

	let status = 'ERROR';

	try {
		await bot.bot.telegram.setWebhook(
			`${config.baseUrl}/bot${config.webhookRouteToken}`,
			{
				allowed_updates: ['message', 'channel_post'],
			},
		);
		status = 'SUCCESS';
	} catch {
		status = 'ERROR';
	}

	return res.status(status === 'SUCCESS' ? 200 : 500).json({ status });
};

module.exports = setWebhookHandler;
