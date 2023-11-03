const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const acccessSecret = 'access-token-secret';
const refreshSecret = 'refresh-token-secret';

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, age, password } = req.body;
    console.log(firstName, lastName, age, password);
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

    const accessToken = jwt.sign({ userId: savedUser._id, firstname: savedUser.firstName, lastName: savedUser.lastName }, acccessSecret, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ userId: savedUser._id, firstname: savedUser.firstName, lastName: savedUser.lastName }, refreshSecret, { expiresIn: '1d' });

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
    const { firstName, password } = req.body;
    const user = await User.findOne({ firstName });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = jwt.sign({ userId: user._id, firstname: user.firstName, lastName: user.lastName }, acccessSecret, { expiresIn: '5m' });
    const refreshToken = jwt.sign({ userId: user._id, firstname: user.firstName, lastName: user.lastName }, refreshSecret, { expiresIn: '1d' });

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
    return res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.logout = async (req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    maxAge: 0
  });
  res.cookie('refreshToken', '', {
    httpOnly: true,
    maxAge: 0
  });
  return res.status(202).json({ success: true });
}

exports.action = async (req, res) => {
  return res.status(202).json({ user: req.user });
}