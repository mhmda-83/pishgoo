const axios = require('axios');
const randomRangeNumber = require('../utils/randomRangeNumber');

const quoteFetcher = axios.create({
	baseURL: 'https://goodquotesapi.herokuapp.com/',
});

const api = {
	getTag: (url) => quoteFetcher.get(`/tag/${url}`).then((r) => r.data),
};

class QuoteApi {
	static async getRandomQuote(tag) {
		const firstPage = await api.getTag(tag);
		const randomPageIndex = randomRangeNumber(1, firstPage.total_pages + 1);
		let randomPage = firstPage;
		if (randomPageIndex !== 1) {
			randomPage = await api.getTag(`${tag}?count=${randomPageIndex}`);
		}
		const { quotes } = randomPage;
		const quotesCount = quotes.length;
		const randomQuoteIndex = randomRangeNumber(0, quotesCount + 1);
		const randomQuote = quotes[randomQuoteIndex];
		console.log(randomQuote);
		return {
			text: randomQuote.quote,
			author: randomQuote.author.trim(),
		};
	}
}

module.exports = { QuoteApi };
