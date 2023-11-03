const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Token = require('../middlewares/jwtToken');

router.post('/createuser', userController.createUser);
router.get('/logout', Token.authenticate, userController.logout)
router.get('/action', Token.authenticate, userController.action);
router.post('/login', userController.login);

module.exports = router;