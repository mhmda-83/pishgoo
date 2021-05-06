const { Composer } = require('telegraf');
const { predictHandler } = require('./predictHandler');
const { startHandler } = require('./startHandler');
const { deathEasterEggHandler } = require('./deathEasterEggHandler');

const botHandlers = new Composer();

botHandlers.start(startHandler);

botHandlers.command('predict', predictHandler);

botHandlers.hears(
	/when am i (going to|gonna) (die|bite the dust)/i,
	deathEasterEggHandler,
);

module.exports = { botHandlers };
