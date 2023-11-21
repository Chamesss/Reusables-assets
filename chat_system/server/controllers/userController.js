const User = require('../models/user');
const bcrypt = require('bcrypt');
const { signAccessJWT, signRefreshJWT } = require('../middlewares/verifyjwt');

const setCookie = (res, name, value, maxAge) => {
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: 'None',
    secure: true,
    maxAge,
  });
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json('User already exists');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();

    // Set tokens and cookies
    const accessToken = signAccessJWT(user);
    const refreshToken = signRefreshJWT(user);
    setCookie(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000); // 1 day

    return res.status(200).json({ user: savedUser, accessToken });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { firstName, password } = req.body;
    const user = await User.findOne({ firstName });
    if (!user) {
      return res.status(401).json('Invalid username');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json('Invalid password');
    }

    // Set tokens and cookies
    const accessToken = signAccessJWT(user);
    const refreshToken = signRefreshJWT(user);
    setCookie(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000); // 1 day

    return res.json({ user, accessToken });
  } catch (error) {
    res.status(500).json(error.message);
  }
}

exports.logout = async (req, res) => {
  setCookie(res, 'refreshToken', '', 0);
  return res.status(200).json({ success: true });
}

exports.action = async (req, res) => {
  console.log('action well performed !')
  return res.status(200).json({ ...req.user, message: "Action well performed" });
}

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
}