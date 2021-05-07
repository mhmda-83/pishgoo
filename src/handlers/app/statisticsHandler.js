/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const Statistics = require('../../models/statistics');

const statisticsHandler = ({ bot, config }) => async (req, res) => {
	if (req.query.token !== config.token) return res.sendStatus(403);

	const chatIds = (
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

	const allOfChatIds = Array.from(new Set([...chatIds, ...userIds]));

	let allOfChats = [];

	for (let i = 0; i < allOfChatIds.length; i += 1) {
		allOfChats.push(bot.telegram.getChat(allOfChatIds[i]));
	}

	allOfChats = await Promise.allSettled(allOfChats);

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

	allOfChats = allOfChats.filter(
		(promiseResult) => promiseResult.status === 'fulfilled',
	);

	allOfChats = allOfChats.map((promiseResult) =>
		_.pick(promiseResult.value, wantedFields),
	);

	const users = allOfChats.filter(
		(chat) => userIds.findIndex((userId) => userId === chat.id) >= 0,
	);
	const chats = allOfChats.filter(
		(chat) => chatIds.findIndex((chatId) => chatId === chat.id) >= 0,
	);

	const nonPrivateChats = allOfChats.filter((chat) => chat.type !== 'private');

	return res.json({
		chats,
		chatsCount: chats.length,
		users,
		usersCount: users.length,
		nonPrivateChats,
		nonPrivateChatsCount: nonPrivateChats.length,
	});
};

module.exports = statisticsHandler;
