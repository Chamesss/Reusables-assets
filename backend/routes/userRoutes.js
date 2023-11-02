const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Token = require('../middlewares/jwtToken');

router.post('/createuser', userController.createUser);
router.get('/action', Token.verifyToken, userController.action);
//router.get('/', userController.geUuser);

module.exports = router;