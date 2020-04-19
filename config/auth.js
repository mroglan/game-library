module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if(req.isAuthenticated()) {
			//console.log("is authenticated");
			return next();
		} 
		req.flash('error_msg', 'Please log in to view this resource');
		res.redirect('/users/login');
	},
	ensureNotAuthenticated: function(req, res, next) {
		if(!req.isAuthenticated()) {
			return next();
		}
		res.redirect('/catalog/dashboard');
	},
	ensureAdmin: function(req, res, next) {
		if(req.user.admin == true) {
			return next();
		}
		res.redirect('/catalog/dashboard');
	}
};