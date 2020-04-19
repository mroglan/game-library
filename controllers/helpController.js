const Faq = require('../models/Faq');

const {check, validationResult} = require('express-validator');
const {sanitizeBody} = require('express-validator/filter');

// Models
const Chat = require('../models/Chat');
const Message = require('../models/Message');

exports.faqs_get = function(req, res, next) {
	Faq.find().exec((err, faqs) => {
		if(err) return next(err);
		res.render('faq_list', {title: 'FAQs', user: req.user, faqs: faqs, a1: 'faq_list'});
	});
};

exports.faqs_create_get = function(req, res, next) {
	res.render('faq_create', {title: 'Add a FAQ', user: req.user, a1: 'faq_create'});
};

exports.faqs_create_post = [
	check('question', 'A question is required').trim().isLength({min: 1}),
	check('answer', 'An answer is required').trim().isLength({min: 1}),
	
	(req, res, next) => {
		
		const errors = validationResult(req);
		
		var faq = new Faq({
			question: req.body.question,
			answer: req.body.answer,
			votes: 0,
			voted_users: []
		});
		
		if(!errors.isEmpty()) {
			res.render('faq_create', {title: 'Add a FAQ', user: req.user, a1: 'faq_create', faq: faq, errors: errors.array()});
			return;
		} else {
			faq.save(err => {
				if(err) return next(err);
				res.redirect('/help/faqs');
			});
		}
	}
];

exports.faqs_add_like = function(req, res, next) {
	//console.log(req.body.userid + ", " + req.body.faqid);
	Faq.findById(req.body.faqid).populate('voted_users').exec((err, faq) => {
		if(err) return next(err);
		var users = faq.voted_users;
		users.push(req.body.userid);
		var newFaq = new Faq({
			question: faq.question,
			answer: faq.answer,
			votes: faq.votes + 1,
			post_date: faq.post_date,
			voted_users: users,
			_id: faq._id
		});
		Faq.findByIdAndUpdate(req.body.faqid, newFaq, {}, (err, result) => {
			if(err) return next(err);
			res.redirect('back');
		});
	});
};

exports.faqs_remove_like = function(req, res, next) {
	Faq.findById(req.body.faqid).populate('voted_users').exec((err, faq) => {
		if(err) return next(err);
		var users = faq.voted_users;
		users.splice(users.indexOf(req.body.userid));
		var newFaq = new Faq({
			question: faq.question,
			answer: faq.answer,
			votes: faq.votes - 1,
			post_date: faq.post_date,
			voted_users: users,
			_id: faq._id
		});
		Faq.findByIdAndUpdate(req.body.faqid, newFaq, {}, (err, result) => {
			if(err) return next(err);
			res.redirect('back');
		});
	});
};

exports.support_get = function(req, res, next) {
	Chat.find({start_user: req.user._id}).exec((err, chats) => {
		if(err) return next(err);
		res.render('chat_list', {title: 'Contact Us!', user: req.user, chats: chats, a1: 'chat_list'});
	});
};

exports.support_post = function(req, res, next) {
	var chat = new Chat({
		start_user: req.user._id,
		name: req.body.chat_name,
		messages: []
	});
	chat.save(err => {
		if(err) return next(err);
		res.redirect(chat.url)
	});
};

exports.chat_get = function(req, res, next) {
	Chat.findById(req.params.id).populate('messages').populate('start_user').exec((err, chat) => {
		if(err) return next(err);
		if(chat.start_user._id.toString() != req.user._id.toString()) {
			res.redirect('/help/support');
			return;
		}
		res.render('chat', {user: req.user, chat: chat, a1: 'chat'});
	});
};

exports.chat_post = [
	
	(req, res, next) => {
		var message = new Message({
			message_user: req.user._id,
			message: req.body.message,
			chat: req.params.id,
			date: Date.now()
		});
		message.save(err => {
			if(err) return next(err);
			next();
		});
	},
	
	(req, res, next) => {
		Message.find({chat: req.params.id}).exec((err, messages) => {
			var chat = new Chat({
				start_user: req.body.start_user,
				name: req.body.chat_name,
				messages: messages,
				_id: req.params.id
			});
			Chat.findByIdAndUpdate(req.params.id, chat, {}, (err, result) => {
				if(err) return next(err);
				if(req.user.admin == true) {
					res.redirect('/help/support/admin');
					return;
				}
				res.redirect('/help/support');
			});
		});
	}
];

exports.support_admin_get = function(req, res, next) {
	Chat.find().populate('start_user').populate('messages').exec((err, chats) => {
		if(err) return next(err);
		res.render('chat_list_admin', {title: 'Conversations', user: req.user, chats: chats});
	});
};

exports.chat_admin_get = function(req, res, next) {
	Chat.findById(req.params.id).populate('start_user').populate('messages').exec((err, chat) => {
		res.render('chat', {user: req.user, chat: chat, a1: 'chat'});
	});
};
	