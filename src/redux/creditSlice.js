import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listOfCredits: [],
  selectedCredit: {},
};
const creditSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    getCredits(state, action) {
      return {
        ...state,
        listOfCredits: Array.from(action.payload).sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      };
    },
    setSelectedCredit(state, action) {
      return { ...state, selectedCredit: action.payload };
    },
  },
});

export const { getCredits, setSelectedCredit } = creditSlice.actions;
export default creditSlice.reducer;
