const mongoose = require('mongoose');
const express = require('express');

const app = express();

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
	path: path.join(__dirname, '..', '.env'),
});

const bot = require('./bot');
const Statistics = require('./models/statistics');

const { getConfigs } = require('./configs');

const configs = getConfigs();

app.use(express.json());
app.post(`/bot${configs.botToken}`, (req, res) => {
	bot.processUpdate(req.body);
	res.sendStatus(200);
});
app.get(`/bot${configs.botToken}/statistics`, async (req, res) => {
	const chatIds = (
		await Statistics.aggregate([
			{
				$group: {
					_id: '$chat.id',
				},
			},
		])
	)
		// eslint-disable-next-line no-underscore-dangle
		.map((chat) => chat._id);

	let chats = [];

	for (let i = 0; i < chatIds.length; i += 1) {
		chats.push(bot.getChat(chatIds[i]));
	}

	chats = await Promise.all(chats);

	res.json({ chats });
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
