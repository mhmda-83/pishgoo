const path = require('path');
const dotenv = require('dotenv');

const { Bot } = require('./bot');
const { App } = require('./server');

const { getConfigs } = require('./configs');

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

const config = getConfigs();

const bot = new Bot(config);
const app = new App(config, bot);
app.launch();
