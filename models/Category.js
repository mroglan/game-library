const mongoose = require('mongoose');

const Schema = mongoose.Schema;

CategorySchema = new Schema({
	name: {type: String, required: true}
});

CategorySchema.virtual('url').get(function() { return '/catalog/categories/' + this._id;});

module.exports = mongoose.model('Category', CategorySchema);