import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './mongodb.js';
import Painting from '../models/Painting.js';
import User from '../models/User.js';

const samplePaintings = [
  {
    title: 'Sunset Over the Ganges',
    description: 'A breathtaking view of the golden sunset reflecting on the sacred Ganges river. This oil painting captures the spiritual essence and tranquility of the holy river.',
    price: 8500,
    originalPrice: 10000,
    category: 'Landscape',
    medium: 'Oil on Canvas',
    artist: 'Arjun Sharma',
    stock: 1,
    isFeatured: true,
    tags: ['sunset', 'river', 'india', 'spiritual'],
    images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', public_id: '' }],
    dimensions: { width: 60, height: 40, unit: 'cm' },
  },
  {
    title: 'Abstract Monsoon',
    description: 'Bold and expressive abstract painting inspired by the Indian monsoon season. Vivid blues and greys dance across the canvas evoking the joy of first rains.',
    price: 5500,
    category: 'Abstract',
    medium: 'Acrylic on Canvas',
    artist: 'Priya Nair',
    stock: 2,
    isFeatured: true,
    tags: ['monsoon', 'abstract', 'rain', 'blue'],
    images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', public_id: '' }],
    dimensions: { width: 50, height: 50, unit: 'cm' },
  },
  {
    title: 'Portrait of Serenity',
    description: 'A masterful portrait capturing the quiet strength and grace of a classical Indian woman in traditional attire.',
    price: 12000,
    category: 'Portrait',
    medium: 'Oil on Canvas',
    artist: 'Kavita Menon',
    stock: 1,
    isFeatured: true,
    tags: ['portrait', 'woman', 'classical', 'indian'],
    images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', public_id: '' }],
    dimensions: { width: 45, height: 60, unit: 'cm' },
  },
  {
    title: 'Himalayan Morning',
    description: 'The first light of dawn kissing the snow-capped Himalayan peaks. A serene landscape painted with meticulous detail.',
    price: 15000,
    originalPrice: 18000,
    category: 'Landscape',
    medium: 'Watercolor',
    artist: 'Rajan Verma',
    stock: 1,
    isFeatured: false,
    tags: ['himalaya', 'mountains', 'morning', 'snow'],
    images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', public_id: '' }],
    dimensions: { width: 70, height: 50, unit: 'cm' },
  },
  {
    title: 'Vibrant Market Scene',
    description: 'A lively depiction of a traditional Indian bazaar overflowing with color, life, and activity. Every brushstroke tells a story.',
    price: 7200,
    category: 'Traditional',
    medium: 'Acrylic on Canvas',
    artist: 'Sunita Gupta',
    stock: 3,
    isFeatured: true,
    tags: ['market', 'india', 'colorful', 'life'],
    images: [{ url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800', public_id: '' }],
    dimensions: { width: 80, height: 60, unit: 'cm' },
  },
  {
    title: 'Modern Geometry',
    description: 'A contemporary geometric abstract using bold primary colors and sharp lines. Perfect for modern interiors.',
    price: 4200,
    category: 'Modern',
    medium: 'Acrylic on Canvas',
    artist: 'Dev Patel',
    stock: 5,
    isFeatured: false,
    tags: ['geometric', 'modern', 'abstract', 'colorful'],
    images: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', public_id: '' }],
    dimensions: { width: 40, height: 40, unit: 'cm' },
  },
  {
    title: 'Lotus in Bloom',
    description: 'A delicate watercolor painting of a lotus flower emerging from still water. Symbol of purity and enlightenment.',
    price: 3800,
    category: 'Watercolor',
    medium: 'Watercolor on Paper',
    artist: 'Anita Singh',
    stock: 4,
    isFeatured: false,
    tags: ['lotus', 'flower', 'watercolor', 'nature'],
    images: [{ url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5d?w=800', public_id: '' }],
    dimensions: { width: 30, height: 40, unit: 'cm' },
  },
  {
    title: 'Urban Solitude',
    description: 'A thoughtful depiction of a lone figure navigating the bustling streets of a modern Indian city. Captures the paradox of being alone in a crowd.',
    price: 9500,
    category: 'Modern',
    medium: 'Oil on Canvas',
    artist: 'Rohan Das',
    stock: 1,
    isFeatured: true,
    tags: ['urban', 'city', 'modern', 'solitude'],
    images: [{ url: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800', public_id: '' }],
    dimensions: { width: 60, height: 80, unit: 'cm' },
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await Painting.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@paintingstore.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
    });

    // Add paintings
    await Painting.insertMany(samplePaintings.map((p) => ({ ...p, createdBy: admin._id })));

    console.log('✅ Seed completed!');
    console.log('👤 Admin: admin@paintingstore.com / admin123');
    console.log('👤 User:  test@example.com / test123');
    console.log(`🖼️  ${samplePaintings.length} paintings added`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();