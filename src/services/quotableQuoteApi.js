const axios = require('axios');

const quoteFetcher = axios.create({
	baseURL: 'https://api.quotable.io/',
});

class QuoteApi {
	static async getRandomQuote(tag) {
		const quote = await quoteFetcher.get(`/random?tags=${tag}`);

		return {
			text: quote.data.content,
			author: quote.data.author,
		};
	}
}

module.exports = { QuoteApi };
