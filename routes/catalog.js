const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureNotAuthenticated, ensureAdmin} = require('../config/auth');

//Controllers
const GameController = require('../controllers/gameController');
const DeveloperController = require('../controllers/developerController');
const CategoryController = require('../controllers/categoryController');
const CopyController = require('../controllers/copyController');

// Dashboard page 
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {user: req.user}));

// Game Routes
router.get('/games/create', ensureAuthenticated, ensureAdmin, GameController.create_game_get);

router.post('/games/create', GameController.create_game_post);

router.get('/games', ensureAuthenticated, GameController.game_list);

router.get('/games/:id', ensureAuthenticated, GameController.game_info);

router.get('/games/:id/update', ensureAuthenticated, ensureAdmin, GameController.update_game_get);

router.post('/games/:id/update', GameController.update_game_post);

router.get('/games/:id/delete', ensureAuthenticated, ensureAdmin, GameController.delete_game_get);

router.post('/games/:id/delete', GameController.delete_game_post);

router.get('/games/:id/available', ensureAuthenticated, GameController.available_copies);

router.get('/games/:id/rate', ensureAuthenticated, GameController.game_rate_get);

router.post('/games/:id/rate', GameController.game_rate_post);

// Developer Routes 
router.get('/developers/create', ensureAuthenticated, ensureAdmin, DeveloperController.create_developer_get);

router.post('/developers/create', DeveloperController.create_developer_post);

router.get('/developers', ensureAuthenticated, DeveloperController.developer_list);

router.get('/developers/:id', ensureAuthenticated, DeveloperController.developer_info);

router.get('/developers/:id/update', ensureAuthenticated, ensureAdmin, DeveloperController.update_developer_get);

router.post('/developers/:id/update', DeveloperController.update_developer_post);

router.get('/developers/:id/delete', ensureAuthenticated, ensureAdmin, DeveloperController.delete_developer_get);

router.post('/developers/:id/delete', DeveloperController.delete_developer_post);

// Copy Routes 
router.get('/copies/create', ensureAuthenticated, ensureAdmin, CopyController.create_copy_get);

router.post('/copies/create', CopyController.create_copy_post);

router.get('/copies', ensureAuthenticated, CopyController.copy_list);

router.get('/copies/:id', ensureAuthenticated, CopyController.copy_info_get);

router.post('/copies/:id', CopyController.copy_info_post);

router.get('/copies/:id/update', ensureAuthenticated, ensureAdmin, CopyController.update_copy_get);

router.post('/copies/:id/update', CopyController.update_copy_post);

router.get('/copies/:id/delete', ensureAuthenticated, ensureAdmin, CopyController.delete_copy_get);

router.post('/copies/:id/delete', CopyController.delete_copy_post);

router.get('/copies/:id/return', ensureAuthenticated, CopyController.return_copy_get);

router.post('/copies/:id/return', CopyController.return_copy_post);

// Category Routes 
router.get('/categories/create', ensureAuthenticated, ensureAdmin, CategoryController.create_category_get);

router.post('/categories/create', CategoryController.create_category_post);

router.get('/categories', ensureAuthenticated, CategoryController.category_list);

router.get('/categories/:id', ensureAuthenticated, CategoryController.category_info);

router.get('/categories/:id/update', ensureAuthenticated, ensureAdmin, CategoryController.update_category_get);

router.post('/categories/:id/update', CategoryController.update_category_post);

router.get('/categories/:id/delete', ensureAuthenticated, ensureAdmin, CategoryController.delete_category_get);

router.post('/categories/:id/delete', CategoryController.delete_category_post);


module.exports = router;