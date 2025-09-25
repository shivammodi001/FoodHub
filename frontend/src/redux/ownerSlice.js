import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myShopData: null,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setMyShopData: (state, action) => {
      state.myShopData = action.payload; // shop set karega
    },
    
  },
});

// ✅ Export reducer action correctly
export const {setMyShopData} = ownerSlice.actions;
export default ownerSlice.reducer;
