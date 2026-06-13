import { createSlice } from '@reduxjs/toolkit';

const savedWishlist = (() => {
  try { return JSON.parse(localStorage.getItem('sabhaya_wishlist')) || []; }
  catch { return []; }
})();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: savedWishlist },
  reducers: {
    toggleWishlist: (state, action) => {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(i => i.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('sabhaya_wishlist', JSON.stringify(state.items));
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      localStorage.setItem('sabhaya_wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('sabhaya_wishlist');
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export const selectIsWishlisted = (id) => (state) => state.wishlist.items.some(i => i.id === id);
export default wishlistSlice.reducer;