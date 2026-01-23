import { createSlice } from "@reduxjs/toolkit";

/**
 * ===============================
 * INITIAL STATE
 * ===============================
 */
const initialState = {
  courses: [],
  selectedCourse: null,
  isLoading: false,
};

/**
 * ===============================
 * COURSE SLICE
 * ===============================
 */
const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload;
    },

    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },

    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },

    setCourseLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

/**
 * ===============================
 * EXPORT ACTIONS & REDUCER
 * ===============================
 */
export const {
  setCourses,
  setSelectedCourse,
  clearSelectedCourse,
  setCourseLoading,
} = courseSlice.actions;

export default courseSlice.reducer;