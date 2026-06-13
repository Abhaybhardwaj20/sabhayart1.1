import { createSlice } from '@reduxjs/toolkit';

const savedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem('sabhaya_user'));
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser || null,
    isLoggedIn: !!savedUser,
    isAdmin: savedUser?.role === 'admin',
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
      state.isAdmin = action.payload?.role === 'admin';

      localStorage.setItem(
        'sabhaya_user',
        JSON.stringify(action.payload)
      );
    },

    loginFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isAdmin = false;

      localStorage.removeItem('sabhaya_user');
      localStorage.removeItem('sabhaya_token');
    },

    updateUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };

      localStorage.setItem(
        'sabhaya_user',
        JSON.stringify(state.user)
      );
    },

    /* Added because Profile.jsx imports setUser */
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
      state.isAdmin = action.payload?.role === 'admin';

      localStorage.setItem(
        'sabhaya_user',
        JSON.stringify(action.payload)
      );
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFail,
  logout,
  updateUser,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;