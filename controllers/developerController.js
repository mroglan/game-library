const Developer = require('../models/Developer');
const Game = require('../models/Game');
const async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.create_developer_get = function(req, res, next) {
	res.render('developer_form', {title: 'Add Developer', user: req.user});
};

exports.create_developer_post = [
	
	body('first_name').trim().isLength({min: 1}).withMessage('First name must be specified.').isAlphanumeric().withMessage('First name must be alphanumeric.'),
	body('last_name').trim().isLength({min: 1}).withMessage('Last name must be specified.').isAlphanumeric().withMessage('Last name must be alphanumeric.'),
	body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
	body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),
	
	sanitizeBody('first_name').escape(),
	sanitizeBody('last_name').escape(),
	sanitizeBody('date_of_birth').toDate(),
	sanitizeBody('date_of_death').toDate(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			res.render('developer_form', {title: 'Add Developer', developer: req.body, errors: errors.array(), user: req.user});
			return;
		} else {
			var developer = new Developer({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				date_of_birth: req.body.date_of_birth,
				date_of_death: req.body.date_of_death
			});
			developer.save(err => {
				if(err) return next(err);
				res.redirect(developer.url);
			});
		}
	}
];

exports.developer_list = function(req, res, next) {
	Developer.find().exec((err, developers) => {
		if(err) return next(err);
		res.render('developer_list', {title: 'Developers', user: req.user, developers: developers, a1: 'developer_list'});
	});
};

exports.developer_info = function(req, res, next) {
	async.parallel({
		developer: callback => Developer.findById(req.params.id).exec(callback),
		games: callback => Game.find({developer: req.params.id}).exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('developer_info', {title: results.developer.name, developer: results.developer, games: results.games, user: req.user, a1: 'developer_list'});
	});
};

exports.update_developer_get = function(req, res, next) {
	Developer.findById(req.params.id).exec((err, developer) => {
		if(err) return next(err);
		res.render('developer_form', {title: 'Update ' + developer.name, developer: developer, user: req.user});
	});
};

exports.update_developer_post = [
	body('first_name').trim().isLength({min: 1}).withMessage('First name must be specified.').isAlphanumeric().withMessage('First name must be alphanumeric.'),
	body('last_name').trim().isLength({min: 1}).withMessage('Last name must be specified.').isAlphanumeric().withMessage('Last name must be alphanumeric.'),
	body('date_of_birth', 'Invalid date of birth').optional({checkFalsy: true}).isISO8601(),
	body('date_of_death', 'Invalid date of death').optional({checkFalsy: true}).isISO8601(),
	
	sanitizeBody('first_name').escape(),
	sanitizeBody('last_name').escape(),
	sanitizeBody('date_of_birth').toDate(),
	sanitizeBody('date_of_death').toDate(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			res.render('developer_form', {title: 'Add Developer', developer: req.body, errors: errors.array(), user: req.user});
			return;
		} else {
			var developer = new Developer({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				date_of_birth: req.body.date_of_birth,
				date_of_death: req.body.date_of_death,
				_id: req.params.id
			});
			Developer.findByIdAndUpdate(req.params.id, developer, {}, (err, thedev) => {
				if(err) return next(err);
				res.redirect(thedev.url);
			});
		}
	}
];

exports.delete_developer_get = function(req, res, next) {
	async.parallel({
		developer: callback => Developer.findById(req.params.id).exec(callback),
		games: callback => Game.find({developer: req.params.id}).exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('developer_delete', {title: 'Delete ' + results.developer.name, developer: results.developer, games: results.games, user: req.user});
	});
};

exports.delete_developer_post = function(req, res, next) {
	async.parallel({
		developer: callback => Developer.findById(req.body.devId).exec(callback),
		games: callback => Game.find({developer: req.body.devId}).exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		if(results.games.length > 0) {
			res.render('developer_delete', {title: 'Delete ' + results.developer.name, developer: results.developer, games: results.games, user: req.user});
			return;
		}
		else {
			Developer.findByIdAndRemove(req.body.devId, function deleteDev(err) {
				if(err) return next(err);
				res.redirect('/catalog/developers');
			});
		}
	});
};
		