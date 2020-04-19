const express = require('express');
const router = express.Router();

const {ensureAuthenticated, ensureNotAuthenticated, ensureAdmin} = require('../config/auth');

const HelpController = require('../controllers/helpController');

// FAQS
router.get('/faqs', ensureAuthenticated, HelpController.faqs_get);

router.get('/faqs/create', ensureAuthenticated, ensureAdmin, HelpController.faqs_create_get);

router.post('/faqs/create', HelpController.faqs_create_post);

router.post('/faqs/add_like', HelpController.faqs_add_like);

router.post('/faqs/remove_like', HelpController.faqs_remove_like);

// Contact Page
router.get('/support', ensureAuthenticated, HelpController.support_get);

router.post('/support', HelpController.support_post);

router.get('/support/admin', ensureAuthenticated, ensureAdmin, HelpController.support_admin_get);

router.get('/support/:id/admin', ensureAuthenticated, ensureAdmin, HelpController.chat_admin_get);

router.post('/support/:id/admin', HelpController.chat_post);

router.get('/support/:id', ensureAuthenticated, HelpController.chat_get);

router.post('/support/:id', HelpController.chat_post);

module.exports = router;