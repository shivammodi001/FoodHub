import { useState, useEffect } from "react";
import axios from "axios";
import {serverUrl} from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function useGetCurrentUser() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        setUser(result.data);
      } catch (err) {
        console.log("fetchUser error:", err);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

//   return user;
}

export default useGetCurrentUser;
