const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const FaqSchema = new Schema({
	question: {type: String, required: true},
	answer: {type: String, required: true},
	votes: {type: Number},
	post_date: {type: Date, default: Date.now()},
	voted_users: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

FaqSchema.virtual('post_date_format').get(function() {
	if(this.post_date) return moment(this.post_date).format('MMMM Do, YYYY');
	return '';
});

module.exports = mongoose.model('Faq', FaqSchema);