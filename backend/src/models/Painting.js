import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const paintingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, default: '' },
      },
    ],
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Abstract',
        'Landscape',
        'Portrait',
        'Still Life',
        'Modern',
        'Traditional',
        'Watercolor',
        'Oil',
        'Acrylic',
        'Digital',
        'Other',
      ],
    },
    medium: {
      type: String,
      default: '',
    },
    dimensions: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      unit: { type: String, default: 'cm' },
    },
    artist: {
      type: String,
      required: [true, 'Artist name is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 1,
      min: [0, 'Stock cannot be negative'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: [{ type: String }],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Text search index
paintingSchema.index({ title: 'text', description: 'text', artist: 'text', tags: 'text' });

// Update rating when reviews change
paintingSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating = (total / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

const Painting = mongoose.model('Painting', paintingSchema);
export default Painting;