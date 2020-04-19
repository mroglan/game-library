const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	date_of_birth: {type: Date},
	date_of_death: {type: Date}
});

DeveloperSchema.virtual('url').get(function() { return '/catalog/developers/' + this._id;});

DeveloperSchema.virtual('birth_yyyy_mm_dd').get(function() { return moment(this.date_of_birth).format('YYYY-MM-DD');});
DeveloperSchema.virtual('death_yyyy_mm_dd').get(function() { return moment(this.date_of_death).format('YYYY-MM-DD');});

DeveloperSchema.virtual('birth_format').get(function() {
	return moment(this.date_of_birth).format('MMMM Do, YYYY');
});

DeveloperSchema.virtual('death_format').get(function() {
	if(this.date_of_death) return moment(this.date_of_death).format('MMMM Do, YYYY');
	return '';
});

DeveloperSchema.virtual('name').get(function() {
	let fullname = '';
	if(this.first_name && this.last_name) {
		fullname = this.last_name + ', ' + this.first_name;
	}
	if(!this.first_name || !this.last_name) {
		fullname = '';
	}
	return fullname;
});

module.exports = mongoose.model('Developer', DeveloperSchema);