/* eslint-disable no-underscore-dangle */
const express = require('express');

const { createAppHandlers } = require('./handlers/app');
const { Bot } = require('./bot');

class App {
	constructor(config, statisticsRepo) {
		this.config = config;
		this.bot = new Bot(this.config, statisticsRepo);
		this.app = express();
		this.statisticsRepo = statisticsRepo;

		const handlers = createAppHandlers({
			bot: this.bot,
			config: this.config,
			statisticsRepo,
		});
		this.app.use('/', handlers);
	}

	launch() {
		this.statisticsRepo.connect();
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
