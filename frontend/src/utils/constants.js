export const APP_NAME = "SabhayaArt";
export const APP_TAGLINE = "Original Art for Every Home";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
};

export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const ORDER_STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#10b981",
  cancelled: "#ef4444",
  refunded: "#6b7280",
};

export const PAINTING_CATEGORIES = [
  "Abstract",
  "Landscape",
  "Portrait",
  "Still Life",
  "Figurative",
  "Spiritual",
  "Floral",
  "Modern",
  "Traditional",
  "Watercolor",
];

export const PAINTING_MEDIUMS = [
  "Oil on Canvas",
  "Acrylic on Canvas",
  "Watercolor",
  "Mixed Media",
  "Digital",
  "Pastel",
  "Charcoal",
  "Ink",
];

export const PAINTING_SIZES = [
  { label: 'Small (up to 12")', value: "small" },
  { label: 'Medium (12"–24")', value: "medium" },
  { label: 'Large (24"–36")', value: "large" },
  { label: 'Extra Large (36"+)', value: "xlarge" },
];

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

export const PRICE_RANGES = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000 – ₹30,000", min: 15000, max: 30000 },
  { label: "₹30,000 – ₹60,000", min: 30000, max: 60000 },
  { label: "Above ₹60,000", min: 60000, max: Infinity },
];

export const SHIPPING_CHARGES = {
  standard: 299,
  express: 599,
  free_threshold: 5000,
};

export const ITEMS_PER_PAGE = 12;

export const MAX_REVIEW_IMAGES = 3;
export const MAX_PRODUCT_IMAGES = 8;

export const COUPON_TYPES = {
  PERCENTAGE: "percentage",
  FIXED: "fixed",
  FREE_SHIPPING: "free_shipping",
};

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const LOCAL_STORAGE_KEYS = {
  CART: "sabhaya_cart",
  WISHLIST: "sabhaya_wishlist",
  THEME: "sabhaya_theme",
  RECENTLY_VIEWED: "sabhaya_recently_viewed",
};