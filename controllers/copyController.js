const Copy = require('../models/Copy');
const Game = require('../models/Game');
const User = require('../models/User');
const async = require('async');

const {check, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator/filter');

exports.create_copy_get = function(req, res, next) {
	async.parallel({
		games: callback => Game.find(callback),
		users: callback => User.find(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('copy_form', {title: 'Create a Copy', games: results.games, siteUsers: results.users, user: req.user, a1: 'copyCreate'});
	});
};

exports.create_copy_post = [
	
	check('game', 'Game must be selected').trim().isLength({min: 1}),
	check('imprint', 'Imprint must be specified').trim().isLength({min: 1}),
	check('status', 'Status must be specified').trim().isLength({min: 1}),
	check('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),
	check('copyUser', 'User must be selected').optional({checkFalsy: true}).trim().isLength({min: 1}),
	
	sanitizeBody('*').escape(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		var copy = new Copy({
			game: req.body.game,
			imprint: req.body.imprint,
			status: req.body.status,
			due_back: req.body.due_back,
			copy_user: req.body.copyUser
		});
		
		if(!errors.isEmpty()) {
			async.parallel({
				games: callback => Game.find(callback),
				users: callback => User.find(callback)
			}, (err, results) => {
				if(err) return next(err);
				res.render('copy_form', {title: 'Create a Copy', games: results.games, siteUsers: results.users, user: req.user, a1: 'copyCreate', copy: copy, errors: errors.array()});
			});
			return;
		} else {
			copy.save(err => {
				if(err) return next(err);
				res.redirect(copy.url);
			});
		}
	}
];

exports.copy_list = function(req, res, next) {
	async.parallel({
		copy_count: callback => Copy.countDocuments({}, callback),
		copy_count_available: callback => Copy.countDocuments({status: 'Available'}, callback),
		copy_available: callback => Copy.find({status: 'Available'}).populate('game').exec(callback),
		copy_maintenance: callback => Copy.find({status: 'Maintenance'}).populate('game').exec(callback),
		copy_loaned: callback => Copy.find({status: 'Loaned'}).populate('game').exec(callback),
		copy_reserved: callback => Copy.find({status: 'Reserved'}).populate('game').exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('copy_list', {title: 'Copies', user: req.user, a1: 'copy_list', copy_count: results.copy_count, copy_count_available: results.copy_count_available,
		copy_available: results.copy_available, copy_maintenance: results.copy_maintenance, copy_loaned: results.copy_loaned, copy_reserved: results.copy_reserved});
	});
};

exports.copy_info_get = function(req, res, next) {
	Copy.findById(req.params.id).populate('game').exec((err, copy) => {
		if(err) return next(err);
		res.render('copy_info', {title: 'Copy of ' + copy.game.title, copy: copy, user: req.user, a1: 'copy_info'});
	});
};

exports.copy_info_post = [
	
	check('first_name', 'First name must be specified').trim().isLength({min: 1}),
	check('first_name', 'First name is too long').trim().isLength({max: 30}),
	check('last_name', 'Last name must be specified').trim().isLength({min: 1}),
	check('last_name', 'Last name is too long').trim().isLength({max: 30}),
	check('address', 'Address must be specified').trim().isLength({min: 1}),
	
	sanitizeBody('*').escape(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			Copy.findById(req.params.id).populate('game').exec((err, copy) => {
				if(err) return next(err);
				res.render('copy_info', {title: 'Copy of ' + copy.game.title, copy: copy, user: req.user, a1: 'copy_info', errors: errors.array()});
			});
			return;
		} else {
			Copy.findById(req.params.id).exec((err, original) => {
				if(err) return next(err);
				var copy = new Copy({
					game: original.game,
					imprint: original.imprint,
					status: 'Loaned',
					due_back: Date.now() + 12096e5,
					copy_user: req.user,
					_id: original._id,
				});
				Copy.findByIdAndUpdate(req.params.id, copy, {}, (err, result) => {
					if(err) return next(err);
					res.redirect(result.url);
				});
			});
		}
	}
];

exports.update_copy_get = function(req, res, next) {
	async.parallel({
		copy: callback => Copy.findById(req.params.id).populate('game').exec(callback),
		games: callback => Game.find(callback),
		users: callback => User.find(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('copy_form', {games: results.games, copy: results.copy, user: req.user, a1: 'copyCreate', siteUsers: results.users, title: 'Update ' + results.copy.game.title});
	});
};

exports.update_copy_post = [
	check('game', 'Game must be selected').trim().isLength({min: 1}),
	check('imprint', 'Imprint must be specified').trim().isLength({min: 1}),
	check('status', 'Status must be specified').trim().isLength({min: 1}),
	check('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601(),
	check('copyUser', 'User must be selected').optional({checkFalsy: true}).trim().isLength({min: 1}),
	
	sanitizeBody('*').escape(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		var copy = new Copy({
			game: req.body.game,
			imprint: req.body.imprint,
			status: req.body.status,
			due_back: req.body.due_back,
			copy_user: req.body.copyUser,
			_id: req.params.id
		});
		
		if(!errors.isEmpty()) {
			async.parallel({
				games: callback => Game.find(callback),
				users: callback => User.find(callback)
			}, (err, results) => {
				if(err) return next(err);
				res.render('copy_form', {title: 'Create a Copy', games: results.games, siteUsers: results.users, user: req.user, a1: 'copyCreate', copy: copy, errors: errors.array()});
			});
			return;
		} else {
			Copy.findByIdAndUpdate(req.params.id, copy, {}, (err, thecopy) => {
				if(err) return next(err);
				res.redirect(thecopy.url);
			});
		}
	}
];

exports.delete_copy_get = function(req, res, next) {
	Copy.findById(req.params.id).populate('game').exec((err, copy) => {
		if(err) return next(err);
		res.render('copy_delete', {title: 'Delete Copy of ' + copy.game.title, user: req.user, copy: copy});
	});
};

exports.delete_copy_post = function(req, res, next) {
	Copy.findByIdAndRemove(req.body.copyId, function deleteCopy(err) {
		if(err) return next(err);
		res.redirect('/catalog/copies');
	});
};

exports.return_copy_get = function(req, res, next) {
	Copy.findById(req.params.id).populate('game').exec((err, copy) => {
		if(err) return next(err);
		if(copy.status != 'Loaned' || copy.copy_user.toString() != req.user._id.toString()) {
			res.redirect('/users/mygames');
			return;
		}
		res.render('copy_return', {title: 'Return copy of ' + copy.game.title, copy: copy, user: req.user, a1: 'copy_return'});
	});
};

exports.return_copy_post = function(req, res, next) {
	Copy.findByIdAndUpdate(req.body.copyId, {status: 'Available', copy_user: null, due_back: null}, (err, result) => {
		if(err) return next(err);
		res.redirect('/users/mygames');
	});
};
	
	
	