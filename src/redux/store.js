import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import itemsSlice from "./itemsSlice";
import loadingSlice from "./loadingSlice";

const store = configureStore({
  reducer: {
    login: loginSlice,
    items: itemsSlice,
    loading: loadingSlice,
  },
});

export default store;
