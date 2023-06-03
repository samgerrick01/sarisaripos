import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import itemsSlice from "./itemsSlice";

const store = configureStore({
  reducer: {
    login: loginSlice,
    items: itemsSlice,
  },
});

export default store;
