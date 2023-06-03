import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  selectedItem: {},
};
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    getItems(state, action) {
      return { ...state, items: action.payload };
    },
    setSelectedItem(state, action) {
      return { ...state, selectedItem: action.payload };
    },
  },
});

export const { getItems, setSelectedItem } = itemsSlice.actions;
export default itemsSlice.reducer;
