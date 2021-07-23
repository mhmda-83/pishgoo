const { Router } = require('express');
const statisticsHandler = require('./statisticsHandler');
const setWebhookHandler = require('./setWebhookHandler');

const createAppHandlers = ({ config, bot, statisticsRepo }) => {
	const router = Router();
	router.get(
		`/${config.statisticsRouteToken}/statistics`,
		statisticsHandler({ config, bot, statisticsRepo }),
	);

	router.get(`/setWebhook`, setWebhookHandler({ config, bot }));
	return router;
};

module.exports = { createAppHandlers };
