import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice"
import mapSlice from "./mapSlice"

export const store = configureStore({
  reducer: {
    user: userSlice, // 'user' slice ka reducer
    owner: ownerSlice,
    map: mapSlice,
  },
});

export default store;
