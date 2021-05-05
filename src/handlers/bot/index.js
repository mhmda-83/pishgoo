const { Composer } = require('telegraf');
const { startHandler } = require('./startHandler');

const botComposer = new Composer();

botComposer.start(startHandler);

module.exports = { botComposer };
