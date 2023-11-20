const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const conversationController = require('../controllers/conversationController');

router.post('/msg', conversationController.addMessage);
router.get('/msg/:conversationId', messageController.getMessages);
router.post('/conversation', conversationController.newConversation);
router.get('/conversation/:userId', conversationController.getAllConversations);
router.get('/conversation/find/:firstUserId/:secondUserId', conversationController.getConversationOfTwoUsers);

module.exports = router;