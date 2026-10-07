import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    setAuthData: (state, action) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    clearAuthData: state => {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
