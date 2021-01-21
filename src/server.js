const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const uuid = require('uuid');

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

const webhookRouteToken = uuid.v4();
const statisticsRouteToken = uuid.v4();

app.use(bot.webhookCallback(`/bot${webhookRouteToken}`));

// eslint-disable-next-line consistent-return
app.get(`/${statisticsRouteToken}/statistics`, async (req, res) => {
	if (req.query.token !== configs.token) return res.sendStatus(403);
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

	const userIds = (
		await Statistics.aggregate([
			{
				$group: { _id: '$userId' },
			},
		])
	)
		// eslint-disable-next-line no-underscore-dangle
		.map((user) => user._id);

	let chats = [];
	let users = [];

	for (let i = 0; i < chatIds.length; i += 1) {
		chats.push(bot.getChat(chatIds[i]));
	}

	for (let i = 0; i < userIds.length; i += 1) {
		users.push(bot.getChat(userIds[i]));
	}

	chats = await Promise.allSettled(chats);
	users = await Promise.allSettled(users);

	const wantedFields = [
		'id',
		'title',
		'first_name',
		'last_name',
		'bio',
		'description',
		'username',
		'type',
	];

	chats = chats.filter((promiseResult) => promiseResult.status === 'fulfilled');
	users = users.filter((promiseResult) => promiseResult.status === 'fulfilled');

	chats = chats.map((promiseResult) =>
		_.pick(promiseResult.value, wantedFields),
	);
	users = users.map((promiseResult) =>
		_.pick(promiseResult.value, wantedFields),
	);

	res.json({
		chats,
		chats_count: chats.length,
		users,
		users_count: users.length,
	});
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
			console.log(`webhook route token: ${webhookRouteToken}`);
			console.log(`statistics route token: ${statisticsRouteToken}`);
			if (!configs.isProduction) bot.launch();
		});
	})
	.catch(console.error);
