import { useState, useEffect } from "react";
import axios from "axios";
import {serverUrl} from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setShopsInMyCity } from "../redux/userSlice";

function useGetShopByCity() {
  const dispatch = useDispatch();
  const {currentCity} = useSelector(state=>state.user);
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`, {
          withCredentials: true,
        });
        console.log(result.data);
        dispatch(setShopsInMyCity(result.data));
      } catch (err) {
        console.log("GetShop error:", err);
      }
    };
    fetchShop();
  }, [currentCity]);


}

export default useGetShopByCity;
