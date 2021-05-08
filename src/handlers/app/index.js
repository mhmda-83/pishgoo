const { Router } = require('express');
const statisticsHandler = require('./statisticsHandler');

const createAppHandlers = ({ config, bot, statisticsRepo }) => {
	const router = Router();
	router.get(
		`/${config.statisticsRouteToken}/statistics`,
		statisticsHandler({ config, bot, statisticsRepo }),
	);
	return router;
};

module.exports = { createAppHandlers };
