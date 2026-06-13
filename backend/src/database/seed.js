import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const samplePaintings = [
  {
    title: 'Sunset Over the Ganges',
    description: 'A breathtaking view of the golden sunset reflecting on the sacred Ganges river.',
    price: 8500, originalPrice: 10000, category: 'Landscape',
    medium: 'Oil on Canvas', artist: 'Arjun Sharma', stock: 1, isFeatured: true,
    tags: ['sunset', 'river', 'india'],
    images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', public_id: '' }],
    dimensions: { width: 60, height: 40, unit: 'cm' },
  },
  {
    title: 'Abstract Monsoon',
    description: 'Bold abstract painting inspired by the Indian monsoon season.',
    price: 5500, category: 'Abstract', medium: 'Acrylic on Canvas',
    artist: 'Priya Nair', stock: 2, isFeatured: true,
    tags: ['monsoon', 'abstract', 'rain'],
    images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', public_id: '' }],
    dimensions: { width: 50, height: 50, unit: 'cm' },
  },
  {
    title: 'Portrait of Serenity',
    description: 'A masterful portrait capturing the quiet strength of a classical Indian woman.',
    price: 12000, category: 'Portrait', medium: 'Oil on Canvas',
    artist: 'Kavita Menon', stock: 1, isFeatured: true,
    tags: ['portrait', 'woman', 'classical'],
    images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', public_id: '' }],
    dimensions: { width: 45, height: 60, unit: 'cm' },
  },
  {
    title: 'Himalayan Morning',
    description: 'The first light of dawn kissing the snow-capped Himalayan peaks.',
    price: 15000, originalPrice: 18000, category: 'Landscape',
    medium: 'Watercolor', artist: 'Rajan Verma', stock: 1, isFeatured: false,
    tags: ['himalaya', 'mountains', 'snow'],
    images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', public_id: '' }],
    dimensions: { width: 70, height: 50, unit: 'cm' },
  },
  {
    title: 'Vibrant Market Scene',
    description: 'A lively depiction of a traditional Indian bazaar.',
    price: 7200, category: 'Traditional', medium: 'Acrylic on Canvas',
    artist: 'Sunita Gupta', stock: 3, isFeatured: true,
    tags: ['market', 'india', 'colorful'],
    images: [{ url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800', public_id: '' }],
    dimensions: { width: 80, height: 60, unit: 'cm' },
  },
  {
    title: 'Lotus in Bloom',
    description: 'A delicate watercolor painting of a lotus flower emerging from still water.',
    price: 3800, category: 'Watercolor', medium: 'Watercolor on Paper',
    artist: 'Anita Singh', stock: 4, isFeatured: false,
    tags: ['lotus', 'flower', 'nature'],
    images: [{ url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5d?w=800', public_id: '' }],
    dimensions: { width: 30, height: 40, unit: 'cm' },
  },
];

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: { type: String, default: 'user' },
  avatar: { type: String, default: '' }, phone: { type: String, default: '' },
  wishlist: [], firebaseUid: { type: String, default: null },
}, { timestamps: true });

const paintingSchema = new mongoose.Schema({
  title: String, description: String, price: Number, originalPrice: Number,
  images: [{ url: String, public_id: String }], category: String,
  medium: String, dimensions: { width: Number, height: Number, unit: String },
  artist: String, stock: Number, sold: { type: Number, default: 0 },
  isFeatured: Boolean, isAvailable: { type: Boolean, default: true },
  tags: [String], reviews: [], rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 }, createdBy: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', userSchema);
    const Painting = mongoose.model('Painting', paintingSchema);

    await Painting.deleteMany({});
    await User.deleteMany({});

    const bcrypt = await import('bcryptjs');
    const hashedAdmin = await bcrypt.default.hash('admin123', 12);
    const hashedUser = await bcrypt.default.hash('test123', 12);

    const admin = await User.create({
      name: 'Admin User', email: 'admin@paintingstore.com',
      password: hashedAdmin, role: 'admin',
    });

    await User.create({
      name: 'Test User', email: 'test@example.com', password: hashedUser,
    });

    await Painting.insertMany(samplePaintings.map(p => ({ ...p, createdBy: admin._id })));

    console.log('✅ Seed completed!');
    console.log('👤 Admin: admin@paintingstore.com / admin123');
    console.log('👤 User:  test@example.com / test123');
    console.log('🖼️  6 paintings added');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();