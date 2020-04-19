const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureNotAuthenticated} = require('../config/auth');

// User Controller
const UserController = require('../controllers/userController');

// Login page
router.get('/login', ensureNotAuthenticated, UserController.register_get);

// Register page
router.get('/register', ensureNotAuthenticated, UserController.login_get);

//Register handle
router.post('/register', UserController.register_post);

//Login handle 
router.post('/login', UserController.login_post);

// Logout handle
router.get('/logout', ensureAuthenticated, UserController.logout);

// Profile page 
router.get('/profile', ensureAuthenticated, UserController.profile_get);

router.post('/profile/user_info', ensureAuthenticated, UserController.user_info_post);

router.get('/profile/picture', ensureAuthenticated, UserController.user_pic_get);

router.post('/profile/picture', UserController.user_pic_post);

router.get('/profile/address', ensureAuthenticated, UserController.user_address_get);

router.post('/profile/address', UserController.user_address_post);

// Game Library

router.get('/mygames', ensureAuthenticated, UserController.user_games_get);

module.exports = router;