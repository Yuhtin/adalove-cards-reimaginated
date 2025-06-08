const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.authenticate(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        iconUrl: user.iconUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, iconUrl } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const existingUser = await User.getByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const existingEmail = await User.getByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const userData = { username, email, password, iconUrl };
    const newUser = await User.create(userData);

    const token = jwt.sign(
      { id: newUser.id, email: newuser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        iconUrl: newUser.iconUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.getById(userId);

    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user profile without password
    const { password, ...userProfile } = user;
    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, iconUrl } = req.body;

    // Validate input
    if (!username || username.trim().length === 0) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Check if username is already taken by another user
    const existingUser = await User.getByUsername(username);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Update user profile
    const updatedUser = await User.update(userId, {
      username: username.trim(),
      iconUrl: iconUrl || null
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return updated profile without password
    const { password, ...userProfile } = updatedUser;
    res.status(200).json({
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const success = await User.changePassword(userId, oldPassword, newPassword);

    if (success) {
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Old password is incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  verifyToken,
  getProfile,
  updateProfile,
  changePassword
};