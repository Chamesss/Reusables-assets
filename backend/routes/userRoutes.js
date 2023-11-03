const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { deserializeUser } = require('../middlewares/checkerUser');
const Token = require('../middlewares/jwtToken');
const app = express();

app.use( deserializeUser );
router.post('/createuser', userController.createUser);
router.get('/action', Token.verifyToken, userController.action);
router.post('/login', userController.login);

module.exports = router;