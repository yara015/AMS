// controllers/authController.js

const User = require('../models/User');
const Token=require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { env } = require('process');
require('dotenv').config();




// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Helper function to send emails
const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password,confirmpassword, role } = req.body;
    console.log(name,email,password,confirmpassword,role);
    // Validate input data
    if (!name || !email || !password || !role ||!confirmpassword) {
      return res.status(400).json({ success: false, errors:['All fields are required.' ]});
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, errors:[ 'Email already in use.' ]});
    }
    if(password!=confirmpassword){
      return res.status(400).json({ success: false, errors:[ 'password doesnot match']});
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Save the user to the database
    await newUser.save();

    // Generate a token
    const token = generateToken(newUser);

    // Send welcome email
    sendEmail(
      email,
      'Welcome to Apartment Management System',
      `Hello ${name},\n\nWelcome to the Apartment Management System. Your account has been created successfully.\n\nBest Regards,\nManagement Team`
    );

    res.status(201).json({ success: true, errors:[ 'User registered successfully.'], token });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, errors:['Server error. Please try again later.'], error });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    if (!email || !password) {
      return res.status(400).json({ success: false, errors:[ 'Email and password are required.'] });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, errors: ['user doesnot exists sign up.'] });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, errors: ['Invalid email or password.'] });
    }

    // Generate a token
    const token = generateToken(user);

    res.status(200).json({ success: true, errors:[ 'Logged in successfully.'], token });

    sendEmail(
      email,
      'Welcome to Apartment Management System',
      `Hello ${user.name},\n\nWelcome to the Apartment Management System. Your logged in successfully.\n\nBest Regards,\nManagement Team`
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Retrieve user profile
    const user = await User.findById(userId)//.select('password');
    if (!user) {
      return res.status(404).json({ success: false, errors:[ 'User not found.'] });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    // Validate input data
    if (!name && !email && !password) {
      return res.status(400).json({ success: false, errors:[ 'At least one field is required to update.'] });
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, errors:[ 'User not found.'] });
    }

    res.status(200).json({ success: true, errors:[ 'Profile updated successfully.'], user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // Validate input data
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, errors:[ 'Both old and new passwords are required.'] });
    }

    // Retrieve user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, errors:[ 'User not found.'] });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, errors:[ 'Old password is incorrect.'] });
    }

    // Hash new password and update
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, errors:[ 'Password changed successfully.'] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// Logout a user
exports.logout = (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, errors:[ 'Logged out successfully.'] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};
// const redis = require('redis');
// const client = redis.createClient();

// // Error handling for Redis connection
// client.on('error', (err) => {
//   console.error('Redis error:', err);
// });

//Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input data
    if (!email) {
      return res.status(400).json({ success: false, errors:[ 'Email is required.' ]});
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, errors:[ 'User not found.'] });
    }

    // Generate or reuse a reset token
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      }).save();
    }

    // Send reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${token.token}`;
    sendEmail(
      email,
      'Password Reset Request',
      `Hello,\n\nYou requested to reset your password. Please use the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\nBest Regards,\nManagement Team`
    );

    res.status(200).json({ success: true, errors:[ 'Password reset email sent.' ]});
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { newPassword } = req.body;
    const {confirmpassword}=req.body;

    // Validate input data
    if (!newPassword) {
      return res.status(400).json({ success: false, errors:[ 'New password is required.'] });
    }
    if(newPassword!=confirmpassword){
      return res.status(400).json({ success: false, errors:[ 'password doesnot match!'] });
    }

    // Find the token and associated user
    const token = await Token.findOne({ token: resetToken });
    if (!token) {
      return res.status(400).json({ success: false, errors:[ 'Invalid or expired token.' ]});
    }

    const user = await User.findById(token.userId);
    if (!user) {
      return res.status(400).json({ success: false, errors:[ 'User not found.' ]});
    }

    // Hash new password and update user
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Delete the token
    await token.delete();

    res.status(200).json({ success: true, errors:[ 'Password reset successfully.'] });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// Admin: Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, errors:[ 'User not found.' ]});
    }

    // Delete the user
    await user.remove();
    res.status(200).json({ success: true, errors:[ 'User deleted successfully.'] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.'], error });
  }
};

// // Admin: Update user role
// exports.updateUserRole = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.body;

//     // Validate input data
//     if (!role) {
//       return res.status(400).json({ success: false, errors:[ 'Role is required.' });
//     }

//     // Check if user exists
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ success: false, errors:[ 'User not found.' });
//     }

//     // Update the role
//     user.role = role;
//     await user.save();

//     res.status(200).json({ success: true, errors:[ 'User role updated successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, errors:[ 'Server error. Please try again later.', error });
//   }
// };
