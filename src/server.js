/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const express = require('express');
const _ = require('lodash');
const { nanoid } = require('nanoid');

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

const webhookRouteToken = nanoid();
const statisticsRouteToken = nanoid();

app.use(bot.webhookCallback(`/bot${webhookRouteToken}`));

// eslint-disable-next-line consistent-return
app.get(`/${statisticsRouteToken}/statistics`, async (req, res) => {
	if (req.query.token !== configs.token) return res.sendStatus(403);

	let chatIds = (
		await Statistics.aggregate([
			{
				$group: {
					_id: '$chat.id',
				},
			},
		])
	)
		.filter((chat) => chat._id != null)
		.map((chat) => chat._id);

	const userIds = (
		await Statistics.aggregate([
			{
				$group: { _id: '$userId' },
			},
		])
	)
		.filter((user) => user._id != null)
		.map((user) => user._id);

	chatIds = Array.from(new Set([...chatIds, ...userIds]));

	let chats = [];

	for (let i = 0; i < chatIds.length; i += 1) {
		chats.push(bot.telegram.getChat(chatIds[i]));
	}

	chats = await Promise.allSettled(chats);

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

	chats = chats.map((promiseResult) =>
		_.pick(promiseResult.value, wantedFields),
	);

	const users = chats.filter(
		(chat) => userIds.findIndex((userId) => userId === chat.id) >= 0,
	);

	res.json({
		chats,
		chatsCount: chats.length,
		users,
		usersCount: users.length,
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
			if (configs.isProduction)
				bot.telegram
					.setWebhook(`${configs.baseUrl}/bot${webhookRouteToken}`)
					.then(() => {
						console.log('webhook was set');
					})
					.catch(console.error);
			if (!configs.isProduction) bot.launch();
		});
	})
	.catch(console.error);
