import User from '../models/User.js';
import Painting from '../models/Painting.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'title price images artist');
    if (!user) throw ApiError.notFound('User not found');
    ApiResponse.success(res, { user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) throw ApiError.notFound('User not found');

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (avatar) user.avatar = avatar;

    await user.save();
    ApiResponse.success(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Remove painting from wishlist
// @route   POST /api/users/wishlist/:paintingId
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { paintingId } = req.params;

    const painting = await Painting.findById(paintingId);
    if (!painting) throw ApiError.notFound('Painting not found');

    const user = await User.findById(req.user._id);
    const isWishlisted = user.wishlist.includes(paintingId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== paintingId);
    } else {
      user.wishlist.push(paintingId);
    }

    await user.save();
    const message = isWishlisted ? 'Removed from wishlist' : 'Added to wishlist';
    ApiResponse.success(res, { wishlisted: !isWishlisted, wishlist: user.wishlist }, message);
  } catch (error) {
    next(error);
  }
};

// @desc    Get wishlist
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'title price images artist category isAvailable stock',
    });
    ApiResponse.success(res, { wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    ApiResponse.success(res, {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw ApiError.notFound('User not found');
    if (user.role === 'admin') throw ApiError.forbidden('Cannot delete admin user');

    await user.deleteOne();
    ApiResponse.success(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/users/:id/role
// @access  Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) throw ApiError.badRequest('Invalid role');

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) throw ApiError.notFound('User not found');

    ApiResponse.success(res, { user }, 'Role updated successfully');
  } catch (error) {
    next(error);
  }
};