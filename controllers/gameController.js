const Developer = require('../models/Developer');
const Category = require('../models/Category');
const Copy = require('../models/Copy');
const Game = require('../models/Game');
const Rating = require('../models/Rating');
const async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.create_game_get = function(req, res, next) {
	async.parallel({
		categories: function(callback) {
			return Category.find(callback);
		},
		developers: function(callback) {
			return Developer.find(callback);
		}
	}, (err, results) => {
		if(err) return next(err);
		res.render('game_form', {title: 'Add Game', categories: results.categories, developers: results.developers, user: req.user});
	});
};

exports.create_game_post = [
	
	(req, res, next) => {
		if(!(req.body.category instanceof Array)) {
			if(typeof req.body.category === 'undefined') req.body.category = [];
			else req.body.category = Array(req.body.category);
		}
		console.log(req.body.category);
		next();
	},
	
	body('title', 'Title must be specified').trim().isLength({min: 1}),
	body('developer', 'Developer must be specified').trim().isLength({min: 1}),
	body('summary', 'Summary must be specified').trim().isLength({min: 1}),
	body('create_date', 'Invalid date').isISO8601(),
	
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		console.log(req.body.category);
		
		const imageName = req.file != null ? req.file.filename : null;
		
		var game = new Game({
			title: req.body.title,
			developer: req.body.developer,
			summary: req.body.summary,
			category: req.body.category,
			create_date: req.body.create_date,
			image: imageName
		});
		
		saveImage(game, req.body.image);
		
		if(!errors.isEmpty()) {
			async.parallel({
				developers: callback => Developer.find(callback),
				categories: callback => Category.find(callback)
			}, (err, results) => {
				if(err) return next(err);
				for(let i = 0; i < results.categories.length; i++) {
					if(game.category.indexOf(results.categories[i]._id) > -1) {
						results.categories[i].checked = true;
					}
				}
				res.render('game_form', {title: 'Add Game', developers: results.developers, categories: results.categories, game: game, errors: errors.array(), user: req.user});
			});
			return;
		} else {
			game.save(function(err) {
				if(err) { return next(err); }
				res.redirect(game.url);
			});
		}
	}
];
	
exports.game_list = function(req, res, next) {
	Game.find().populate('developer').populate('category').exec((err, games) => {
		if(err) return next(err);
		var availables = [];
		var count = 0;
		//console.log(games.length);
		games.forEach(function(thegame, index) {
			Copy.findOne({status: 'Available', game: thegame._id}).exec((err, result) => {
				if(err) return next(err);
				//console.log(index);
				if(result) availables[index] = result;
				else availables[index] = null;
				count++;
				if(count === games.length) {
					//console.log(availables);
					res.render('game_list', {title: 'Games', games: games, user: req.user, a1: 'game_list', availables: availables});
				}
			});
		});
	});
};

exports.game_info = function(req, res, next) {
	async.parallel({
		game: callback => Game.findById(req.params.id).populate('category').populate('developer').exec(callback),
		copies: callback => Copy.countDocuments({game: req.params.id}, callback),
		copies_available: callback => Copy.countDocuments({game: req.params.id, status: 'Available'}, callback),
		ratings: callback => Rating.find({game: req.params.id}).exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('game_info', {title: results.game.title, user: req.user, game: results.game, copies: results.copies, copies_available: results.copies_available, ratings: results.ratings, a1: 'game_info'});
	});
};

exports.update_game_get = function(req, res, next) {
	async.parallel({
		game: callback => Game.findById(req.params.id).populate('developer').populate('category').exec(callback),
		categories: callback => Category.find(callback),
		developers: callback => Developer.find(callback)
	}, (err, results) => {
		if(err) return next(err);
		if(results.game === null) {
			var error = new Error('Game not found');
			error.status = 404;
			return next(err);
		}
		for(let i = 0; i < results.categories.length; i++) {
			for(let j = 0; j < results.game.category.length; j++) {
				if(results.game.category[j]._id.toString() === results.categories[i]._id.toString()) {
					results.categories[i].checked = true;
				}
			}
		}
		res.render('game_form', {title: 'Update ' + results.game.title, game: results.game, categories: results.categories, developers: results.developers, user: req.user});
	});
};

exports.update_game_post = [
	
	(req, res, next) => {
		if(!(req.body.category instanceof Array)) {
			if(typeof req.body.category === 'undefined') req.body.category = [];
			else req.body.category = Array(req.body.category);
		}
		//console.log(req.body.category);
		next();
	},
	
	body('title', 'Title must be specified').trim().isLength({min: 1}),
	body('developer', 'Developer must be specified').trim().isLength({min: 1}),
	body('summary', 'Summary must be specified').trim().isLength({min: 1}),
	body('create_date', 'Invalid date').isISO8601(),
	
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		//const imageName = req.file != null ? req.file.filename : null;
		const imageName = req.file != null ? req.file.filename : null;
		
		var game = new Game({
			title: req.body.title,
			developer: req.body.developer,
			summary: req.body.summary,
			category: req.body.category,
			create_date: req.body.create_date,
			image: imageName,
			_id: req.params.id
		});
		
		saveImage(game, req.body.image);
			
		//console.log(req.body.category);
		//console.log("hello")
		
		if(!errors.isEmpty()) {
			async.parallel({
				developers: callback => Developer.find(callback),
				categories: callback => Category.find(callback)
			}, (err, results) => {
				if(err) return next(err);
				for(let i = 0; i < results.categories.length; i++) {
					if(game.category.indexOf(results.categories[i]._id) > -1) {
						results.categories[i].checked = true;
					}
				}
				res.render('game_form', {title: 'Add Game', developers: results.developers, categories: results.categories, game: game, errors: errors.array(), user: req.user});
			});
			return;
		} else {
			Game.findByIdAndUpdate(req.params.id, game, {}, (err, thegame) => {
				if(err) return next(err);
				res.redirect(thegame.url);
			});
		}
	}
];

exports.delete_game_get = function(req, res, next) {
	async.parallel({
		game: callback => Game.findById(req.params.id).exec(callback),
		copies: callback => Copy.find({game: req.params.id}).exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		res.render('game_delete', {title: 'Delete ' + results.game.title, game: results.game, copies: results.copies, user: req.user});
	});
};

exports.delete_game_post = function(req, res, next) {
	Game.findById(req.params.id).exec((err, game) => {
		if(err) return next(err);
		Copy.remove({game: game._id});
		Game.findByIdAndRemove(game._id, function deleteGame(err) {
			if(err) return next(err);
			res.redirect('/catalog/games');
		});
	});
};

exports.available_copies = function(req, res, next) {
	Copy.find({game: req.params.id, status: 'Available'}).populate('game').exec((err, copy) => {
		if(err) return next(err);
		if(copy === null) {
			res.redirect('/catalog/games/' + req.params.id);
			return;
		}
		res.render('game_available', {title: 'Available Copies for ' + copy[0].game.title, copies: copy, user: req.user});
	});
};

exports.game_rate_get = function(req, res, next) {
	async.parallel({
		game: callback => Game.findById(req.params.id).exec(callback),
		rating: callback => Rating.find({user: req.user._id, game: req.params.id}).exec(callback)
	}, (err, results) => {
		if(err) return next(err);
		//console.log(results.rating);
		if(results.rating.length === 0) results.rating = null;
		res.render('rate_game', {title: 'Rate ' + results.game.title, game: results.game, user: req.user, rating: results.rating, a1: 'rate_game'});
	});
};

exports.game_rate_post = [
	body('stars', 'You must rate the game').isLength({min: 1}),
	body('title', 'You must tile your rating').isLength({min: 1}),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		if(!errors.isEmpty()) {
			Game.findById(req.params.id).exec((err, game) => {
				if(err) return next(err);
				var rating = [];
				rating[0] = new Rating({stars: parseInt(req.body.stars, 10), review: req.body.review, title: req.body.title, date: Date.now(), user: req.user_id, game: req.params.id});
				res.render('rate_game', {title: 'Rate ' + game.title, game: game, user: req.user, a1: 'rate_game', errors: errors.array(), rating: rating});
			});
			return
		} else {
			Rating.find({user: req.user._id, game: req.params.id}).exec((err, result) => {
				if(err) return next(err);
				console.log(result);
				if(result.length === 0) {
					var rating = new Rating({
						stars: parseInt(req.body.stars, 10),
						review: req.body.review,
						title: req.body.title,
						date: Date.now(),
						user: req.user._id,
						game: req.params.id
					});
					rating.save(function(err) {
						if(err) { return next(err); }
						res.redirect('/catalog/games/' + req.params.id);
					});
				} else {
					var rating = new Rating({
						stars: parseInt(req.body.stars, 10),
						review: req.body.review,
						title: req.body.title,
						date: Date.now(),
						user: req.user._id,
						game: req.params.id,
						_id: result[0]._id
					});
					Rating.findByIdAndUpdate(result[0]._id, rating, {}, (err, result) => {
						if(err) return next(err);
						res.redirect('/catalog/games/' + req.params.id);
					});
				}
			});
		}
	}
];
			
		




function saveImage(game, imageEncoded) {
	if(imageEncoded == null) return;
	const gameCover = JSON.parse(imageEncoded);
	if(gameCover != null) {
		game.image = new Buffer.from(gameCover.data, 'base64');
		game.imageType = gameCover.type;
	}
}
	




