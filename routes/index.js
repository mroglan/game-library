const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureNotAuthenticated} = require('../config/auth');

// Welcome page
router.get('/', ensureNotAuthenticated, (req, res) => res.render('welcome'));

module.exports = router;