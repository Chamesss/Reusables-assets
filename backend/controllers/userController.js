const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Token = require('../middlewares/jwtToken');

// const acccessSecret = 'access-token-secret';
// const refreshSecret = 'refresh-token-secret';

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, age, password } = req.body;
    const existingUser = await User.findOne({ firstName, lastName });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      firstName,
      lastName,
      age,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    const accessToken = Token.signJWT({userId: savedUser._id}, "5m")
    const refreshToken = Token.signJWT({ userId: savedUser._id }, '1d');

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'None', secure: false,
      maxAge: 300000 // 5 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None', secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 1day
    });
    return res.json({ savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = jwt.sign({ userId: savedUser._id }, '', { expiresIn: '5m' });
    const refreshToken = jwt.sign({ userId: savedUser._id }, 'refresh-token-secret', { expiresIn: '1d' });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None', secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ accessToken });
  } catch (err) {

  }
}

exports.action = async (req, res) => {
  return res.send(req.user);
}