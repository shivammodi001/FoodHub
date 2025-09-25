import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: {
    lat: null,
    lon: null,
  },
  address: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setLocaion: (state, action) => {
      const { lat, lon } = action.payload;
      state.location.lat = lat;
      state.location.lon = lon;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const {setLocaion , setAddress } = mapSlice.actions;

export default mapSlice.reducer;
