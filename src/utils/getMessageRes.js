const messages = require('../data/messages');

function getMessageRes(emoji, value) {
	if (typeof emoji !== 'string' && typeof value !== 'number') {
		throw Error('type of emoji and value parameter must be string & number');
	}

	switch (emoji) {
		case '🏀':
			return messages.basketballResponses[value - 1];
		case '🎲':
			return `عدد ${value} 🤓`;
		case '🎯':
			return messages.dartResponses[value - 1];
		case '⚽':
			return messages.footballResponses[value - 1];
		case '🎳':
			return messages.bowlingResponses[value - 1];
		case '🎰': {
			const numbers = [1, 22, 43, 64];

			return numbers.includes(value)
				? messages.doubleTripleChance.successful
				: messages.doubleTripleChance.unsuccessful;
		}
		default:
			return value;
	}
}

module.exports = getMessageRes;
