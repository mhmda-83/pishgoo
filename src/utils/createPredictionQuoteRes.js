function createPredictionQuoteRes({ text, author }) {
	return `${text}\n\n\n –${author}`;
}

module.exports = createPredictionQuoteRes;
