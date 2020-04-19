const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String, 
		required: true
	}, 
	admin: {
		type: Boolean,
		required: true
	},
	date: {
		type: Date,
		default: Date.now()
	},
	picture: {
		type: Buffer
	},
	pictureType: {
		type: String
	},
	first_name: {type: String},
	last_name: {type: String},
	address: {type: String}
});

UserSchema.virtual('picPath').get(function() {
	if(this.picture != null && this.pictureType != null) {
		return `data:${this.pictureType};charset=utf-8;base64,${this.picture.toString('base64')}`
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;