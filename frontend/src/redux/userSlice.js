import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData: null,
    city:null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload; // user set karega
    },
    setCity: (state,action)=>{
      state.city = action.payload;
    },
  },
});

// ✅ Export reducer action correctly
export const { setUserData , setCity} = userSlice.actions;
export default userSlice.reducer;
