const bcrypt = require('bcryptjs');
const passport = require('passport');

// Models
const User = require('../models/User');
const Copy = require('../models/Copy');

const {check, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator/filter');

exports.logout = function(req, res, next) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
};

exports.login_get = function(req, res, next) {
	res.render('register');
};

exports.login_post = function(req, res, next) {
	passport.authenticate('local', {
		successRedirect: '/catalog/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
};

exports.register_get = function(req, res, next) {
	res.render('login');
};

exports.register_post = function(req, res, next) {
	
	const {name, email, password, password2} = req.body;
	let errors = [];
	
	// Check required fields
	if(!name || !email || !password || !password2) {
		errors.push({msg: 'Please fill in all fields'});
	}
	
	// Check passwords match
	if(password != password2) {
		errors.push({msg: 'Passwords do not match'});
	}
	
	//Check pass length
	if(password.length < 6) {
		errors.push({msg: 'Password should be at least 6 characters'});
	}
	
	if(errors.length > 0) {
		res.render('register', {
			errors,
			name,
			email, 
			password, 
			password2
		});
	} else {
		// Validation passed
		User.findOne({email: email}).then(user => {
			if(user) {
				// User exists
				errors.push({msg: 'Email is already registered'});
				res.render('register', {
					errors,
					name,
					email, 
					password, 
					password2
				});
			} else {
				const newUser = new User({name, email, password, admin: false});
				// same as newUser = new User({name: name, email: email, password: password});
				
				// Hash password
				bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
					if(err) throw err;
					// Set password to hashed
					newUser.password = hash;
					//Save user 
					newUser.save().then(user => {
						req.flash('success_msg', 'You are now registered and can log in');
						res.redirect('/users/login');
					}).catch(err => console.log(err));
				}));
			}
		});
	}
};

exports.profile_get = function(req, res, next) {
	res.render('user_profile', {user: req.user, a1: 'user_profile'});
};

exports.user_info_post = function(req, res, next) {
	console.log(req.body.user_name);
	User.findByIdAndUpdate(req.user._id, {name: req.body.user_name}, function(err, result) {
		if(err) return next(err);
		res.redirect('/catalog/dashboard');
	});
};

exports.user_pic_get = function(req, res, next) {
	res.render('user_picture', {user: req.user, a1: 'user_pic'});
};

exports.user_pic_post = function(req, res, next) {
	
	const imageName = req.file != null ? req.file.filename : null;
	
	let user = new User({
		name: req.user.name,
		email: req.user.email,
		password: req.user.password,
		admin: req.user.admin,
		date: req.user.date,
		_id: req.user._id,
		first_name: req.user.first_name,
		last_name: req.user.last_name,
		address: req.user.address,
		picture: imageName
	});
	
	saveImage(user, req.body.image);
	
	User.findByIdAndUpdate(req.user._id, user, {}, (err, theuser) => {
		if(err) return next(err);
		res.redirect('/users/profile');
	});
};

exports.user_address_get = function(req, res, next) {
	res.render('user_address', {user: req.user, a1: 'user_address'});
};

exports.user_address_post = [
	
	check('first_name', 'First name must be specified').trim().isLength({min: 1}),
	check('first_name', 'First name is too long').trim().isLength({max: 30}),
	check('last_name', 'Last name must be specified').trim().isLength({min: 1}),
	check('last_name', 'Last name is too long').trim().isLength({max: 30}),
	check('address', 'Address must be specified').trim().isLength({min: 1}),
	
	sanitizeBody('*').escape(),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		var user = new User({
			name: req.user.name,
			email: req.user.email,
			password: req.user.password,
			admin: req.user.admin,
			date: req.user.date,
			_id: req.user._id,
			picture: req.user.picture,
			pictureType: req.user.pictureType,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			address: req.body.address
		});
			
		if(!errors.isEmpty()) {
			res.render('user_address', {user: req.user, a1: 'user_address', errors: errors.array()});
			return;
		} else {
			User.findByIdAndUpdate(req.user._id, user, {}, (err, result) => {
				if(err) return next(err);
				res.redirect('/users/profile');
			});
		}
	}
];

exports.user_games_get = function(req, res, next) {
	Copy.find({status: 'Loaned', copy_user: req.user._id}).populate('game').exec((err, results) => {
		if(err) return next(err);
		console.log(results);
		res.render('user_games', {title: 'Your Games!', copies: results, user: req.user, a1: 'user_games'});
	});
};

function saveImage(user, imageEncoded) {
	if(imageEncoded == null) return;
	const userImage = JSON.parse(imageEncoded);
	if(userImage != null) {
		user.picture = new Buffer.from(userImage.data, 'base64');
		user.pictureType = userImage.type;
	}
}
		