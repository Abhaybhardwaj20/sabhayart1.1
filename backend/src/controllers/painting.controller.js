import Painting from '../models/Painting.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { validatePainting } from '../utils/validations/index.js';

// @desc    Get all paintings (with filters, search, pagination)
// @route   GET /api/paintings
// @access  Public
export const getAllPaintings = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      artist,
      isFeatured,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isAvailable: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = category;
    if (artist) query.artist = new RegExp(artist, 'i');
    if (isFeatured === 'true') query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [paintings, total] = await Promise.all([
      Painting.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Painting.countDocuments(query),
    ]);

    ApiResponse.success(res, {
      paintings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single painting
// @route   GET /api/paintings/:id
// @access  Public
export const getPaintingById = async (req, res, next) => {
  try {
    const painting = await Painting.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!painting) throw ApiError.notFound('Painting not found');
    ApiResponse.success(res, { painting });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured paintings
// @route   GET /api/paintings/featured
// @access  Public
export const getFeaturedPaintings = async (req, res, next) => {
  try {
    const paintings = await Painting.find({ isFeatured: true, isAvailable: true }).limit(8).lean();
    ApiResponse.success(res, { paintings });
  } catch (error) {
    next(error);
  }
};

// @desc    Create painting (Admin)
// @route   POST /api/paintings
// @access  Admin
export const createPainting = async (req, res, next) => {
  try {
    const errors = validatePainting(req.body);
    if (errors.length > 0) throw ApiError.badRequest('Validation failed', errors);

    const paintingData = { ...req.body, createdBy: req.user._id };

    // Handle image upload (local or cloudinary)
    if (req.files && req.files.length > 0) {
      paintingData.images = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        public_id: file.filename || '',
      }));
    } else if (req.body.images) {
      // Accept images as array of URLs
      const imgs = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
      paintingData.images = imgs.map((url) => ({ url, public_id: '' }));
    }

    if (!paintingData.images || paintingData.images.length === 0) {
      paintingData.images = [{ url: 'https://placehold.co/600x400?text=Painting', public_id: '' }];
    }

    const painting = await Painting.create(paintingData);
    ApiResponse.created(res, { painting }, 'Painting created successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Update painting (Admin)
// @route   PUT /api/paintings/:id
// @access  Admin
export const updatePainting = async (req, res, next) => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) throw ApiError.notFound('Painting not found');

    const updates = { ...req.body };

    // Parse existingImages (sent as JSON string from FormData) and merge with new uploads
    let existingImages = [];
    if (updates.existingImages) {
      try {
        const parsed = JSON.parse(updates.existingImages);
        existingImages = (Array.isArray(parsed) ? parsed : [parsed]).map((url) => ({ url, public_id: '' }));
      } catch {
        existingImages = [];
      }
    }
    delete updates.existingImages;

    const newImages = (req.files && req.files.length > 0)
      ? req.files.map((file) => ({
          url: `/uploads/${file.filename}`,
          public_id: file.filename || '',
        }))
      : [];

    const combinedImages = [...existingImages, ...newImages];
    if (combinedImages.length > 0) {
      updates.images = combinedImages;
    } else {
      delete updates.images;
    }

    Object.assign(painting, updates);
    await painting.save();

    ApiResponse.success(res, { painting }, 'Painting updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete painting (Admin)
// @route   DELETE /api/paintings/:id
// @access  Admin
export const deletePainting = async (req, res, next) => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) throw ApiError.notFound('Painting not found');

    await painting.deleteOne();
    ApiResponse.success(res, null, 'Painting deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Add review to painting
// @route   POST /api/paintings/:id/reviews
// @access  Private
export const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) throw ApiError.badRequest('Rating and comment are required');
    if (rating < 1 || rating > 5) throw ApiError.badRequest('Rating must be between 1 and 5');

    const painting = await Painting.findById(req.params.id);
    if (!painting) throw ApiError.notFound('Painting not found');

    // Check if already reviewed
    const alreadyReviewed = painting.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) throw ApiError.conflict('You have already reviewed this painting');

    painting.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    painting.calculateRating();
    await painting.save();

    ApiResponse.success(res, { painting }, 'Review added successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories
// @route   GET /api/paintings/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Painting.distinct('category', { isAvailable: true });
    ApiResponse.success(res, { categories });
  } catch (error) {
    next(error);
  }
};