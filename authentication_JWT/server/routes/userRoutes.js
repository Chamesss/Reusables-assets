const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const Token = require('../middlewares/jwtToken');
const { verifyJWT, refreshToken } = require('../middlewares/verifyJWT');
const app = express();


router.post('/createuser', userController.createUser);
router.post('/login', userController.login);
router.get('/logout', Token.authenticate, userController.logout)
app.use('/refresh', refreshToken);
app.use(verifyJWT);
router.get('/action', Token.authenticate, userController.action);

module.exports = router;