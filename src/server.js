const mongoose = require('mongoose');
const express = require('express');

const app = express();

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

const bot = require('./bot');

const { getConfigs } = require('./configs');

const configs = getConfigs();

app.use(express.json());
app.post(`/bot${configs.botToken}`, (req, res) => {
	bot.processUpdate(req.body);
	res.sendStatus(200);
});

mongoose
	.connect(configs.dbUrl, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database Connected.');
		app.listen(configs.port, () => {
			console.log(`server started on port ${configs.port}`);
		});
	})
	.catch(console.error);
