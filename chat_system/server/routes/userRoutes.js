const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyJWT, refreshToken } = require('../middlewares/verifyJWT');

router.post('/createuser', userController.createUser);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/allusers', userController.getUsers);
router.get('/refresh', refreshToken);
router.get('/verifyjwt', verifyJWT);
router.get('/action', verifyJWT, userController.action);

module.exports = router;