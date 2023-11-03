const jwt = require('jsonwebtoken');

exports.signAccessJWT = (user) => {
  return accessToken = jwt.sign({ userId: user._id, firstName: user.firstName, lastName: user.lastName }, process.env.ACCESS_SECRET, { expiresIn: '5m' });
}

exports.signRefreshJWT = (user) => {
  return refreshToken = jwt.sign({ userId: user._id, firstName: user.firstName, lastName: user.lastName }, process.env.REFRESH_SECRET, { expiresIn: '1d' });
}

exports.authenticate = (req, res, next) => {
  const accessToken = req.cookies['accessToken'];
  const refreshToken = req.cookies['refreshToken'];

  if (!accessToken && !refreshToken) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      req.user = decoded;
      const accessToken = jwt.sign({ userId: decoded.userId, firstName: decoded.firstName, lastName: decoded.lastName }, process.env.ACCESS_SECRET, { expiresIn: '5m' });
      res.cookie('accessToken', accessToken, {
        httpOnly: true, sameSite: 'none', secure: false,
        maxAge: 300000 //5m
      })
      next();
    } catch (error) {
      return res.status(400).send('Invalid Token.');
    }
  }
};