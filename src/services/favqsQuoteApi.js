const axios = require('axios');
const randomRangeNumber = require('../utils/randomRangeNumber');

const quoteFetcher = axios.create({
	baseURL: 'https://favqs.com/api/',
});

class QuoteApi {
	static async getRandomQuote(tag) {
		const randomPageNumber = randomRangeNumber(1, 37);

		const quotes = await quoteFetcher.get(
			`/quotes/?filter=${tag}&type=tag&page=${randomPageNumber}`,
			{
				headers: {
					Authorization: `Token token="${process.env.FAVQS_API_KEY}"`,
				},
			},
		);

		const randomQuoteNumber = randomRangeNumber(1, 25);

		const selectedQuote = quotes.data.quotes[randomQuoteNumber];

		return {
			text: selectedQuote.body,
			author: selectedQuote.author,
		};
	}
}

module.exports = { QuoteApi };
