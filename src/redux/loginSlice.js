import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginSuccess: false,
};
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    loginStatus(state, action) {
      return { ...state, loginSuccess: action.payload };
    },
  },
});

export const { loginStatus } = loginSlice.actions;
export default loginSlice.reducer;
