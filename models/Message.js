const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	message_user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	message: {type: String, required: true},
	chat: {type: Schema.Types.ObjectId, ref: 'Chat', required: true},
	date: {type: Date, default: Date.now()}
});

MessageSchema.virtual('date_format').get(function() {
	if(this.date) return moment(this.date).format('MMMM Do, YYYY');
	return '';
});

module.exports = mongoose.model('Message', MessageSchema);