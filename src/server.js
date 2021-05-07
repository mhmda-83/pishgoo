/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const express = require('express');

const { createAppHandlers } = require('./handlers/app');

class App {
	constructor(config, bot) {
		this.bot = bot;
		this.config = config;
		this.app = express();
		const handlers = createAppHandlers({ bot: this.bot, config: this.config });
		this.app.use('/', handlers);
	}

	launch() {
		mongoose
			.connect(this.config.dbUrl, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log('Database Connected.');
			})
			.catch(console.error);

		this.app.listen(this.config.port, () => {
			console.log(`server started on port ${this.config.port}`);
			console.log(`webhook route token: ${this.config.webhookRouteToken}`);
			console.log(
				`statistics route token: ${this.config.statisticsRouteToken}`,
			);
		});
		if (!this.config.isProduction) this.bot.launchWithPooling();
		else {
			const webhookCallback = this.bot.launchWithWebhook();
			this.app.use(webhookCallback);
		}
	}
}

module.exports = { App };
