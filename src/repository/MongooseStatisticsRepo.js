const mongoose = require('mongoose');

class MongooseStatisticsRepo {
	constructor(config, model) {
		this.model = model;
		this.config = config;
	}

	connect() {
		mongoose
			.connect(this.config.dbUrl, {
				useNewUrlParser: true,
				useCreateIndex: true,
				useFindAndModify: true,
				useUnifiedTopology: true,
			})
			.then(() => {
				console.log('Database Connected.');
			})
			.catch(console.error);
	}

	findAllStatistics() {
		return this.model.find().lean();
	}
}

module.exports = { MongooseStatisticsRepo };
