const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createConversation, getMessagesByConversationId, getConversationByAdmin } = require('../controllers/chatController.js');
const checkAdmin = require('../middleware/checkAdmin');

router.post('/init', auth, createConversation);

router.get('/:conversationId/messages', getMessagesByConversationId);

router.get('/admin/support-tickets', auth, checkAdmin, getConversationByAdmin);

module.exports = router;