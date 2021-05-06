const { QuoteApi } = require('../../services/mamadQuoteApi');
const createPredictionQuoteRes = require('../../utils/createPredictionQuoteRes');

const predictHandler = async (ctx) => {
	const quoteData = await QuoteApi.getRandomQuote('future');
	ctx.reply(createPredictionQuoteRes(quoteData), {
		reply_to_message_id: ctx.message.message_id,
	});
};

module.exports = { predictHandler };
