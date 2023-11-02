const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Token = require('../middlewares/jwtToken');

router.post('/createuser', Token.verifyToken, userController.createUser);
//router.get('/', userController.geUuser);

module.exports = router;