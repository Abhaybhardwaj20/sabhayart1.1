import { LOCAL_STORAGE_KEYS } from "./constants";

// Truncate text
export const truncate = (str, maxLength = 80) => {
  if (!str) return "";
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Slugify
export const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

// Format date
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Time ago
export const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
};

// Average rating
export const avgRating = (reviews = []) => {
  if (!reviews.length) return 0;
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
};

// Discount percentage
export const discountPercent = (original, sale) => {
  if (!original || !sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
};

// Get recently viewed from localStorage
export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.RECENTLY_VIEWED)) || [];
  } catch {
    return [];
  }
};

// Add to recently viewed
export const addToRecentlyViewed = (product) => {
  const list = getRecentlyViewed().filter((p) => p._id !== product._id);
  list.unshift(product);
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.RECENTLY_VIEWED,
    JSON.stringify(list.slice(0, 10))
  );
};

// Group array by key
export const groupBy = (arr, key) =>
  arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

// Generate order ID
export const generateOrderId = () =>
  "SA" + Date.now().toString(36).toUpperCase();

// Check if image URL is valid
export const isValidImageUrl = (url) => {
  if (!url) return false;
  return url.startsWith("http") || url.startsWith("/");
};

// Clamp number
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Debounce
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Deep clone
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Get error message from axios error
export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong.";