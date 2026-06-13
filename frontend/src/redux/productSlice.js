import { createSlice } from '@reduxjs/toolkit';
import { paintings } from '../data/paintings';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items:         paintings,
    loading:       false,
    error:         null,
    activeProduct: null,
  },
  reducers: {
    setProducts:      (state, action) => { state.items = action.payload; },
    setActiveProduct: (state, action) => { state.activeProduct = action.payload; },
    setLoading:       (state, action) => { state.loading = action.payload; },
    setError:         (state, action) => { state.error = action.payload; },
  },
});

export const { setProducts, setActiveProduct, setLoading, setError } = productSlice.actions;
export default productSlice.reducer;