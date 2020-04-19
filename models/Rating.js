const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const RatingSchema = new Schema({
	stars: {type: Number, required: true},
	review: {type: String},
	title: {type: String, required: true},
	date: {type: Date, default: Date.now()},
	user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
	game: {type: Schema.Types.ObjectId, required: true, ref: 'Game'}
});

RatingSchema.virtual('date_format').get(function() {
	if(this.date) return moment(this.date).format('MMMM Do, YYYY');
	return '';
});

module.exports = mongoose.model('Rating', RatingSchema);
