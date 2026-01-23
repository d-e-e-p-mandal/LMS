import { createSlice } from "@reduxjs/toolkit";

/**
 * ===============================
 * AUTH INITIAL STATE
 * ===============================
 */
const initialState = {
  user: null,
  isAuthenticated: false,
};

/**
 * ===============================
 * AUTH SLICE
 * ===============================
 */
const authSlice = createSlice({
  name: "auth", // ✅ IMPORTANT: use simple slice name
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

/**
 * ===============================
 * EXPORT ACTIONS & REDUCER
 * ===============================
 */
export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;