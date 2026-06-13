import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validateRegister, validateLogin } from '../utils/validations/index.js';
import { config } from '../config/env.js';

const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const errors = validateRegister({ name, email, password });
    if (errors.length > 0) throw ApiError.badRequest('Validation failed', errors);

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) throw ApiError.conflict('Email already registered');

    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password });
    const token = generateToken(user._id);

    ApiResponse.created(res, { user, token }, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const errors = validateLogin({ email, password });
    if (errors.length > 0) throw ApiError.badRequest('Validation failed', errors);

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    if (!user.password) throw ApiError.unauthorized('Please use Google login for this account');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

    const token = generateToken(user._id);
    const userObj = user.toJSON();

    ApiResponse.success(res, { user: userObj, token }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'title price images');
    if (!user) throw ApiError.notFound('User not found');
    ApiResponse.success(res, { user }, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Firebase Google login/register
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res, next) => {
  try {
    const { name, email, firebaseUid, avatar } = req.body;

    if (!email || !firebaseUid) throw ApiError.badRequest('Email and Firebase UID are required');

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        firebaseUid,
        avatar,
        isEmailVerified: true,
      });
    } else if (!user.firebaseUid) {
      user.firebaseUid = firebaseUid;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = generateToken(user._id);
    ApiResponse.success(res, { user, token }, 'Google authentication successful');
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) throw ApiError.badRequest('Current and new password are required');
    if (newPassword.length < 6) throw ApiError.badRequest('New password must be at least 6 characters');

    const user = await User.findById(req.user._id).select('+password');
    if (!user.password) throw ApiError.badRequest('Account uses Google login, no password to update');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    ApiResponse.success(res, { token }, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Logout (client-side, just for API completeness)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    ApiResponse.success(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};