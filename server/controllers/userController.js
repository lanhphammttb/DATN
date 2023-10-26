const User = require('../models/user');
const bcrypt = require('bcrypt');
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!user || user.password !== password) {
      // Invalid credentials
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Successful login
    res.json({ message: 'Login successful' });
  });
};

exports.createUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password asynchronously.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user object.
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });

    // Save the new user to the database.
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('User creation error:', error);
    return res.status(500).json({ message: error.message });
  }
};
