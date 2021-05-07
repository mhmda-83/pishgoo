const path = require('path');
const dotenv = require('dotenv');

const { createBot, launchBot } = require('./bot');
const { createApp, launchApp } = require('./server');

const { getConfigs } = require('./configs');

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

const config = getConfigs();

const bot = createBot({ config });
const app = createApp({ config, bot });

launchBot({ bot, config });
launchApp({ app, config });
