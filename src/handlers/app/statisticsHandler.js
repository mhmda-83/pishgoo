/* eslint-disable no-underscore-dangle */
const _ = require('lodash');

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

const statisticsHandler = ({ bot, config, statisticsRepo }) => async (
	req,
	res,
) => {
	if (req.query.token !== config.token) return res.sendStatus(403);

	const statistics = await statisticsRepo.findAllStatistics();

	const chatIds = statistics
		.filter((doc) => doc.chat.id != null)
		.map((doc) => doc.chat.id);

	const userIds = statistics
		.filter((user) => user.id != null)
		.map((user) => user.id);

	const allOfChatIds = _.uniq(chatIds.concat(userIds));

	const allOfChatsPromise = allOfChatIds.map(async (id) => {
		const chat = await bot.getChatById(id);
		return _.pick(chat, wantedFields);
	});

	const allOfChatsPromiseRes = await Promise.allSettled(allOfChatsPromise);
	const allOfChats = allOfChatsPromiseRes
		.filter((promiseResult) => promiseResult.status === 'fulfilled')
		.map((p) => p.value);

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
