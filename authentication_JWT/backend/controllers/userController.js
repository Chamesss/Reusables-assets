const User = require('../models/user');
const bcrypt = require('bcrypt');
const Token = require('../middlewares/jwtToken');

const setCookie = (res, name, value, maxAge) => {
  res.cookie(name, value, {
    httpOnly: true,
    sameSite: 'None',
    secure: false,
    maxAge,
  });
};

const setTokensAndCookies = async (res, user) => {
  const accessToken = Token.signAccessJWT(user);
  const refreshToken = Token.signRefreshJWT(user);
  setCookie(res, 'accessToken', accessToken, 300000); // 5 minutes
  setCookie(res, 'refreshToken', refreshToken, 24 * 60 * 60 * 1000); // 1 day
};

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

    // Set tokens and cookies
    await setTokensAndCookies(res, savedUser);

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

    // Set tokens and cookies
    await setTokensAndCookies(res, user);

    return res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.logout = async (req, res) => {
  setCookie(res, 'accessToken', '', 0);
  setCookie(res, 'refreshToken', '', 0);
  return res.status(200).json({ success: true });
}

exports.action = async (req, res) => {
  return res.status(200).json({ ...req.user, message: "Action well performed" });
}