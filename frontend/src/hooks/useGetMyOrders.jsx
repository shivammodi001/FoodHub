import { useState, useEffect } from "react";
import axios from "axios";
import {serverUrl} from "../App";
import { useDispatch, useSelector } from "react-redux";

import { setMyOrders } from "../redux/userSlice";

function useGetMyOrders() {
  const dispatch = useDispatch();
  const {userData} = useSelector(state=>state.user)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-order`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data));
        console.log(result.data);
      } catch (err) {
        console.log("my Orders error:", err);
      }
    };
    fetchOrders();
  }, [userData]);


}

export default useGetMyOrders;
