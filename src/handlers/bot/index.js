const { Composer } = require('telegraf');
const { predictHandler } = require('./predictHandler');
const { startHandler } = require('./startHandler');

const botHandlers = new Composer();

botHandlers.start(startHandler);

botHandlers.command('predict', predictHandler);

module.exports = { botHandlers };
