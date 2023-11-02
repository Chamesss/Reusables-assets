const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    const accessToken = jwt.sign({ userId: savedUser._id }, 'access-token-secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: savedUser._id }, 'refresh-token-secret', { expiresIn: '1d' });

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None', secure: false,
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.action = async (req, res) => {
  return res.status(202).json({status: true, message: "Action successfully performed!"});
}