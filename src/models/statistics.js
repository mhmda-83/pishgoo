const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		userId: {
			type: Number,
		},
		chat: {
			id: { type: Number, required: true },
		},
	},
	{ timestamps: true },
);

const model = mongoose.model('Statistics', schema, 'statistics');

module.exports = model;
