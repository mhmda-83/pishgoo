const { Composer } = require('telegraf');
const { predictHandler } = require('./predictHandler');
const { startHandler } = require('./startHandler');

const botComposer = new Composer();

botComposer.start(startHandler);

botComposer.command('predict', predictHandler);

module.exports = { botComposer };
