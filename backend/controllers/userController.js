const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, age, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ firstName, lastName });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const user = new User({
      firstName,
      lastName,
      age,
      password: hashedPassword,
    });

    // Save the user to the database
    const savedUser = await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: savedUser._id }, 'your-secret-key', {
      expiresIn: '1h', // Token expiration time (adjust as needed)
    });

    res.status(201).json({ user: savedUser, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};