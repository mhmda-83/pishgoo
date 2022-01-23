const { Composer } = require('telegraf');
const { predictHandler } = require('./predictHandler');
const { startHandler } = require('./startHandler');
const { deathEasterEggHandler } = require('./deathEasterEggHandler');
const {
	pandemicDurationEasterEggHandler,
} = require('./pandemicDurationEasterEggHandler');
const { onChannelPostHandler } = require('./onChannelPostHandler');
const { onMessageHandler } = require('./onMessageHandler');
const { sendBullshitJoke } = require('./sendBullshitJoke');

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

botHandlers.hears(
	/((say a|say) bullshit joke|یه جوک چرت بگو)/i,
	sendBullshitJoke,
);

botHandlers.command('joke', sendBullshitJoke);
botHandlers.on('channel_post', onChannelPostHandler);
botHandlers.on('message', onMessageHandler);

module.exports = { botHandlers };
