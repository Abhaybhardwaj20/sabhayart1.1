import { createSlice } from '@reduxjs/toolkit';

const savedCart = (() => {
  try { return JSON.parse(localStorage.getItem('sabhaya_cart')) || []; }
  catch { return []; }
})();

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items:      savedCart,
    coupon:     null,
    discount:   0,
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      localStorage.setItem('sabhaya_cart', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      localStorage.setItem('sabhaya_cart', JSON.stringify(state.items));
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) item.qty = Math.max(1, qty);
      localStorage.setItem('sabhaya_cart', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items    = [];
      state.coupon   = null;
      state.discount = 0;
      localStorage.removeItem('sabhaya_cart');
    },
    applyCoupon: (state, action) => {
      state.coupon   = action.payload.code;
      state.discount = action.payload.discount; // percentage
    },
    removeCoupon: (state) => {
      state.coupon   = null;
      state.discount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;

export const selectCartTotal    = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
export const selectCartCount    = (state) => state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectDiscountedTotal = (state) => {
  const total    = selectCartTotal(state);
  const discount = state.cart.discount;
  return discount ? total - (total * discount) / 100 : total;
};

export default cartSlice.reducer;