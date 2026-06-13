export const paintings = [
  {
    id: 1,
    title: 'The Way Is Built By Walking',
    category: 'Nature',
    style: 'Acrylic',
    size: '12×16 in',
    price: 799,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 21,
    badge: 'bestseller',
    image: '/images/paintings/111.png',
    images: [
      '/images/paintings/111.png',
      '/images/paintings/112.png'
    ],
    description: 'A peaceful landscape reminding us that every journey is created step by step.',
    inStock: true,
    featured: true,
  },

  {
    id: 2,
    title: 'Mountains Are Moved',
    category: 'Landscape',
    style: 'Acrylic',
    size: '12×16 in',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 17,
    badge: 'new',
    image: '/images/paintings/901.png',
    images: [
      '/images/paintings/901.png',
      '/images/paintings/902.png'
    ],
    description: 'An inspirational mountain scene symbolising patience and perseverance.',
    inStock: true,
    featured: true,
  },

  {
    id: 3,
    title: 'Not All Paths Need Light',
    category: 'Spiritual',
    style: 'Watercolour',
    size: '12×16 in',
    price: 699,
    originalPrice: 999,
    rating: 4.8,
    reviews: 13,
    badge: 'bestseller',
    image: '/images/paintings/801.png',
    images: [
      '/images/paintings/801.png',
      '/images/paintings/802.png'
    ],
    description: 'A monochrome artwork encouraging faith even in uncertain times.',
    inStock: true,
    featured: true,
  },

  {
    id: 4,
    title: 'The Best Is Still Unfolding',
    category: 'Landscape',
    style: 'Acrylic',
    size: '12×16 in',
    price: 799,
    originalPrice: 1099,
    rating: 4.9,
    reviews: 22,
    badge: 'bestseller',
    image: '/images/paintings/701.png',
    images: [
      '/images/paintings/701.png',
      '/images/paintings/702.png'
    ],
    description: 'A beautiful sunset landscape carrying a message of hope and growth.',
    inStock: true,
    featured: true,
  },

  {
    id: 5,
    title: 'Light Always Returns',
    category: 'Nature',
    style: 'Oil',
    size: '12×16 in',
    price: 949,
    originalPrice: 1399,
    rating: 5.0,
    reviews: 25,
    badge: 'new',
    image: '/images/paintings/601.png',
    images: [
      '/images/paintings/601.png',
      '/images/paintings/602.png'
    ],
    description: 'A serene painting symbolising resilience and inner strength.',
    inStock: true,
    featured: true,
  },

  {
    id: 6,
    title: 'Growth Takes Time',
    category: 'Abstract',
    style: 'Mixed Media',
    size: '14×14 in',
    price: 999,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 14,
    badge: 'new',
    image: '/images/paintings/401.png',
    images: [
      '/images/paintings/401.png',
      '/images/paintings/402.png'
    ],
    description: 'A symbolic circular artwork representing personal growth and transformation.',
    inStock: true,
    featured: false,
  },

  {
    id: 7,
    title: 'Every Day Ends In Hope',
    category: 'Spiritual',
    style: 'Oil',
    size: '10×12 in',
    price: 599,
    originalPrice: 899,
    rating: 4.9,
    reviews: 18,
    badge: 'bestseller',
    image: '/images/paintings/301.png',
    images: [
      '/images/paintings/301.png',
      '/images/paintings/302.png',
      '/images/paintings/303.png',
      '/images/paintings/304.png'
    ],
    description: 'A peaceful cottage scene reminding us that every day ends with hope.',
    inStock: true,
    featured: true,
  },

  {
    id: 8,
    title: 'Love Flows Quietly',
    category: 'Nature',
    style: 'Watercolour',
    size: '10×10 cm',
    price: 399,
    originalPrice: 599,
    rating: 4.7,
    reviews: 11,
    badge: null,
    image: '/images/paintings/202.png',
    images: [
      '/images/paintings/201.png',
      '/images/paintings/202.png'
    ],
    description: 'A gentle minimalist artwork celebrating calmness and love.',
    inStock: true,
    featured: false,
  },

  {
    id: 9,
    title: 'Golden Horizon',
    category: 'Landscape',
    style: 'Acrylic',
    size: '12×12 in',
    price: 749,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 15,
    badge: 'new',
    image: '/images/paintings/101.png',
    images: [
      '/images/paintings/101.png',
      '/images/paintings/102.png'
    ],
    description: 'A warm golden landscape bringing positivity and peace.',
    inStock: true,
    featured: false,
  },

  {
    id: 10,
    title: 'Blooming Path',
    category: 'Floral',
    style: 'Acrylic',
    size: '12×16 in',
    price: 849,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 12,
    badge: null,
    image: '/images/paintings/112.png',
    images: [
      '/images/paintings/111.png',
      '/images/paintings/112.png'
    ],
    description: 'A vibrant floral landscape celebrating nature and renewal.',
    inStock: true,
    featured: false,
  }
];

export const getFeatured = () =>
  paintings.filter((p) => p.featured);

export const getByCategory = (cat) =>
  cat === 'all'
    ? paintings
    : paintings.filter(
        (p) =>
          p.category.toLowerCase() ===
          cat.toLowerCase()
      );

export const getById = (id) =>
  paintings.find((p) => p.id === Number(id));