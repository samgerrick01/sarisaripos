import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};
const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    loadingOn(state, action) {
      return { ...state, loading: true };
    },
    loadingOff(state, action) {
      return { ...state, loading: false };
    },
  },
});

export const { loadingOn, loadingOff } = loadingSlice.actions;
export default loadingSlice.reducer;
