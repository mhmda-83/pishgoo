const { Composer } = require('telegraf');
const { predictHandler } = require('./predictHandler');
const { startHandler } = require('./startHandler');
const { deathEasterEggHandler } = require('./deathEasterEggHandler');
const {
	pandemicDurationEasterEggHandler,
} = require('./pandemicDurationEasterEggHandler');
const { onChannelPostHandler } = require('./onChannelPostHandler');
const { onMessageHandler } = require('./onMessageHandler');

const botHandlers = new Composer();

botHandlers.start(startHandler);

botHandlers.command('predict', predictHandler);

botHandlers.hears(
	/when am i (going to|gonna) (die|bite the dust)/i,
	deathEasterEggHandler,
);

botHandlers.hears(
	/when will the corona pandemic end/i,
	pandemicDurationEasterEggHandler,
);

botHandlers.on('channel_post', onChannelPostHandler);
botHandlers.on('message', onMessageHandler);

module.exports = { botHandlers };
