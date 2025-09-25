import { useState, useEffect } from "react";
import axios from "axios";
import {serverUrl} from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setItemsInMyCity } from "../redux/userSlice";

function useGetItemsByCity() {
  const dispatch = useDispatch();
  const {currentCity} = useSelector(state=>state.user);
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`, {
          withCredentials: true,
        });
        console.log(result.data);
        dispatch(setItemsInMyCity(result.data));
      } catch (err) {
        console.log("GetShop error:", err);
      }
    };
    fetchItem();
  }, [currentCity]);


}

export default useGetItemsByCity;
