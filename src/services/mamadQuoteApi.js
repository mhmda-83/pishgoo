const axios = require('axios');
const randomRangeNumber = require('../utils/randomRangeNumber');

const quoteFetcher = axios.create({
	baseURL: 'https://mamadquoteapi.herokuapp.com/',
});

class QuoteApi {
	static async getRandomQuote(tag) {
		const quote = await quoteFetcher.get(`/quotes?Tags_like=${tag}`);

		const index = randomRangeNumber(0, quote.data.length + 1);

		const selectedQuote = quote.data[index];

		return {
			text: selectedQuote.Quote,
			author: selectedQuote.Author,
		};
	}
}

module.exports = { QuoteApi };
