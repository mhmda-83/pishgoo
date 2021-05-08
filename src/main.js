const path = require('path');
const dotenv = require('dotenv');

const { App } = require('./app');

const { getConfigs } = require('./configs');
const Statistics = require('./models/statistics');

const {
	MongooseStatisticsRepo,
} = require('./repository/MongooseStatisticsRepo');

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

const config = getConfigs();
const statisticsRepo = new MongooseStatisticsRepo(config, Statistics);
const app = new App(config, statisticsRepo);
app.launch();
