import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import itemsSlice from "./itemsSlice";
import loadingSlice from "./loadingSlice";
import creditSlice from "./creditSlice";

const store = configureStore({
  reducer: {
    login: loginSlice,
    items: itemsSlice,
    loading: loadingSlice,
    credits: creditSlice,
  },
});

export default store;
