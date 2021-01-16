const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		userId: {
			type: Number,
			required: true,
		},
		chat: {
			id: { type: Number, required: true },
			type: { type: String, required: true },
			title: String,
		},
	},
	{ timestamps: true },
);

const model = mongoose.model('Statistics', schema, 'statistics');

module.exports = model;
