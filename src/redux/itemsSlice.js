import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    getItems(state, action) {
      return { ...state, items: action.payload };
    },
  },
});

export const { getItems } = itemsSlice.actions;
export default itemsSlice.reducer;
