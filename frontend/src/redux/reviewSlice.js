import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    byProduct: {}, // { [productId]: [reviews] }
    loading: false,
    error: null,
  },
  reducers: {
    setReviews: (state, action) => {
      const { productId, reviews } = action.payload;
      state.byProduct[productId] = reviews;
    },
    addReview: (state, action) => {
      const { productId, review } = action.payload;
      if (!state.byProduct[productId]) state.byProduct[productId] = [];
      state.byProduct[productId].unshift(review);
    },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError:   (state, action) => { state.error = action.payload; },
  },
});

export const { setReviews, addReview, setLoading, setError } = reviewSlice.actions;
export default reviewSlice.reducer;