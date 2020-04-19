const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
	start_user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
	messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
	name: {type: String, required: true}
});

ChatSchema.virtual('url').get(function() { return '/help/support/' + this._id;});

module.exports = mongoose.model('Chat', ChatSchema);