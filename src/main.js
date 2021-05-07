const path = require('path');
const dotenv = require('dotenv');

const { App } = require('./app');

const { getConfigs } = require('./configs');

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

const config = getConfigs();

const app = new App(config);
app.launch();
