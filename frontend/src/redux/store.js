import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userSlice, // 'user' slice ka reducer
  },
});

export default store;
