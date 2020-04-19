const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
	title: {type: String, required: true},
	developer: {type: Schema.Types.ObjectId, ref: 'Developer', required: true},
	summary: {type: String, required: true},
	category: [{type: Schema.Types.ObjectId, ref: 'Category'}],
	create_date: {type: Date},
	image: {type: Buffer},
	imageType: {type: String}
});

// Virtual for Game's URL
GameSchema.virtual('url').get(function() { return '/catalog/games/' + this._id;});

GameSchema.virtual('date_yyyy_mm_dd').get(function() { return moment(this.create_date).format('YYYY-MM-DD');});

GameSchema.virtual('date_format').get(function() {
	if(this.create_date) return moment(this.create_date).format('MMMM Do, YYYY');
	return '';
});

GameSchema.virtual('picPath').get(function() {
	if(this.image != null && this.imageType != null) {
		return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
	}
});

module.exports = mongoose.model('Game', GameSchema);


	