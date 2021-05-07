const { Router } = require('express');
const statisticsHandler = require('./statisticsHandler');

const createAppHandlers = ({ config, bot }) => {
	const router = Router();
	router.get(
		`/${config.statisticsRouteToken}/statistics`,
		statisticsHandler({ config, bot }),
	);
	return router;
};

module.exports = { createAppHandlers };
