import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setUserData } from "../redux/userSlice.js";

function Nav() {
  const { userData, city } = useSelector((state) => state.user);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      //   navigate("/signin"); // redirect after logout
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-[80px] flex items-center justify-between px-5 fixed top-0 z-[9999] bg-[#fff9f6] shadow-md">
      {/* Logo */}
      <h1 className="text-3xl font-extrabold text-[#ff4d2d] tracking-wide">
        FoodHub 🍴
      </h1>

      {/* Search + Location Bar (Desktop only) */}
      <div className="hidden md:flex md:w-[60%] lg:w-[40%] h-[60px] bg-white shadow-lg rounded-2xl items-center overflow-hidden">
        <div className="flex items-center gap-2 px-4 border-r border-gray-200">
          <FaLocationDot className="text-red-500" />
          <span className="truncate font-medium text-gray-600">
            {city || "Detecting..."}
          </span>
        </div>
        <div className="flex items-center flex-1 px-4 gap-2">
          <IoSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search delicious food..."
            className="w-full outline-none border-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Cart */}
      <div className="cursor-pointer relative ml-4 hover:scale-110 transition-transform">
        <MdOutlineShoppingCart className="text-2xl text-gray-700" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          0
        </span>
      </div>

      {/* Orders Button (Desktop only) */}
      <button className="hidden md:block bg-[#ff4d2d] text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition">
        My Orders
      </button>

      {/* Profile Avatar */}
      <div
        className="ml-4 w-10 h-10 flex items-center justify-center rounded-full bg-[#ff4d2d] text-white font-bold cursor-pointer relative hover:scale-110 transition"
        onClick={() => setProfileOpen(!profileOpen)}
      >
        {userData?.fullName?.slice(0, 1)}
        {profileOpen && (
          <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl p-4 text-sm z-[99999] animate-fadeIn">
            <p className="font-semibold text-gray-800">{userData?.fullName}</p>
            <p className="text-gray-500 text-xs">{userData?.email}</p>
            <hr className="my-2" />

            {/* My Orders → Only mobile */}
            <div className="block md:hidden">
              <button className="w-full bg-[#ff4d2d] text-white px-2 py-2 rounded-lg hover:bg-[#e63b1d] transition">
                My Orders
              </button>
            </div>

            <button
              className="w-full text-left text-red-500 hover:bg-gray-100 px-2 py-2 rounded-lg transition"
              onClick={handleLogOut}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Search Icon (Only mobile) */}
      <div
        className="md:hidden ml-4 cursor-pointer text-2xl text-gray-700"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <IoSearch />
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="absolute top-[80px] left-0 w-full bg-white shadow-lg flex items-center p-3 gap-2 md:hidden animate-slideDown z-[9999]">
          <FaLocationDot className="text-red-500" />
          <span className="text-gray-600">{city || "Detecting..."}</span>
          <div className="flex items-center flex-1 px-4 gap-2">
            <IoSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full outline-none border-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
