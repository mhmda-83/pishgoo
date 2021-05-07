/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const express = require('express');

const { createAppHandlers } = require('./handlers/app');

const createApp = ({ config, bot }) => {
	const app = express();
	const handlers = createAppHandlers({ bot, config });
	app.use(bot.webhookCallback(`/bot${config.webhookRouteToken}`));
	app.use('/', handlers);

	return app;
};

const launchApp = ({ app, config }) => {
	mongoose
		.connect(config.dbUrl, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log('Database Connected.');
		})
		.catch(console.error);
	app.listen(config.port, () => {
		console.log(`server started on port ${config.port}`);
		console.log(`webhook route token: ${config.webhookRouteToken}`);
		console.log(`statistics route token: ${config.statisticsRouteToken}`);
	});
};

module.exports = { createApp, launchApp };
