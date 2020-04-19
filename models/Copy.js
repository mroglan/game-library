const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const CopySchema = new Schema({
	game: {type: Schema.Types.ObjectId, ref: 'Game', required: true},
	imprint: {type: String, required: true},
	status: {type: String, required: true, enum: ['Available', 'Loaned', 'Reserved', 'Maintenance'], default: 'Maintenance'},
	due_back: {type: Date, default: Date.now()},
	copy_user: {type: Schema.Types.ObjectId, ref: 'User'}
});

CopySchema.virtual('url').get(function() { return '/catalog/copies/' + this._id;});

CopySchema.virtual('due_date_yyyy_mm_dd').get(function() { return moment(this.due_back).format('YYYY-MM-DD');});

CopySchema.virtual('due_back_format').get(function() {
	return moment(this.due_back).format('MMMM Do, YYYY');
});

CopySchema.virtual('is_overdue').get(function() {
	if(Date.now() > this.due_back) {
		return true;
	} else {
		return false;
	}
});

module.exports = mongoose.model('Copy', CopySchema);