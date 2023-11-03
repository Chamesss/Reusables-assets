const jwt = require('jsonwebtoken');

const accessSecret = 'access-token-secret';
const refreshSecret = 'refresh-token-secret';

exports.authenticate = (req, res, next) => {
    const accessToken = req.cookies['accessToken'];
    const refreshToken = req.cookies['refreshToken'];
  
    if (!accessToken && !refreshToken) {
      return res.status(401).send('Access Denied. No token provided.');
    }
  
    try {
      const decoded = jwt.verify(accessToken, accessSecret);
      const user = decoded;
      req.user = user;
      console.log('user : ',user);
      console.log('decoded : ',decoded);
      next();
    } catch (error) {
      if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
      }
  
      try {
        const decoded = jwt.verify(refreshToken, refreshSecret);
        const accessToken = jwt.sign({ userId: decoded.userId, firstname: decoded.firstName, lastName: decoded.lastName }, accessSecret, { expiresIn: '5m' });
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'none', secure: false,
          maxAge: 300000 //5m
        })
          .send(decoded.user);
      } catch (error) {
        return res.status(400).send('Invalid Token.');
      }
    }
  };