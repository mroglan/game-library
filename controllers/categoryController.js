const Category = require('../models/Category');
const Game = require('../models/Game');
const async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.create_category_get = function(req, res, next) {
	res.render('category_form', {title: 'Create a Category', user: req.user});
};

exports.create_category_post = [
	
	body('name', 'Name must be specified.').trim().isLength({min: 1}),
	
	sanitizeBody('name').escape(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			res.render('category_form', {title: 'Create a Category', name: req.body.name, errors: errors.array(), user: req.user});
			return;
		} else {
			var category = new Category({
				name: req.body.name
			});
			category.save(err => {
				if(err) return next(err);
				res.redirect(category.url);
			});
		}
	}
];

exports.category_list = function(req, res, next) {
	Category.find().exec((err, categories) => {
		if(err) return next(err);
		res.render('category_list', {title: 'Categories', user: req.user, categories: categories, a1: 'developer_list'});
	});
};

exports.category_info = function(req, res, next) {
	async.parallel({
		category: callback => Category.findById(req.params.id).exec(callback),
		games: callback => Game.find({'category': req.params.id}).exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('category_info', {title: results.category.name, category: results.category, games: results.games, user: req.user});
	});
};

exports.update_category_get = function(req, res, next) {
	Category.findById(req.params.id).exec((err, category) => {
		if(err) return next(err);
		res.render('category_form', {title: 'Update ' + category.name, name: category.name, user: req.user});
	});
};

exports.update_category_post = [
	
	body('name', 'Name must be specified.').trim().isLength({min: 1}),
	
	sanitizeBody('name').escape(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			res.render('category_form', {title: 'Create a Category', name: req.body.name, errors: errors.array(), user: req.user});
			return;
		} else {
			var category = new Category({
				name: req.body.name,
				_id: req.params.id
			});
			Category.findByIdAndUpdate(req.params.id, category, {}, (err, thecategory) => {
				if(err) return next(err);
				res.redirect(thecategory.url);
			});
		}
	}
];

exports.delete_category_get = function(req, res, next) {
	Category.findById(req.params.id).exec((err, category) => {
		if(err) return next(err);
		res.render('category_delete', {title: 'Delete ' + category.name, category: category, user: req.user});
	});
};

exports.delete_category_post = function(req, res, next) {
	Category.findByIdAndRemove(req.body.catId, function deleteCat(err) {
		if(err) return next(err);
		res.redirect('/catalog/categories');
	});
};