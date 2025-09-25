import React, { useEffect, useState } from "react";
import { FaLocationDot, FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { TbReceipt2 } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { setSearchItems, setUserData } from "../redux/userSlice.js";

function Nav() {
  const { userData, currentCity, cartItems } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);

  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logout
  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
    } catch (err) {
      console.log(err);
    }
  };

  // Search API call
  const handleSearchItems = async (searchQuery) => {
    try {
      if (!currentCity) return;
      const res = await axios.get(
        `${serverUrl}/api/item/search-items?query=${searchQuery}&city=${currentCity}`,
        { withCredentials: true }
      );
      console.log(res.data);
      
      setSearchResults(res.data);
      dispatch(setSearchItems(res.data));
    } catch (err) {
      console.log(err);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() !== "" && currentCity) {
        handleSearchItems(query);
      } else {
        setSearchResults([]);
        dispatch(setSearchItems(null));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, currentCity]);

  return (
    <div className="w-full h-[80px] flex items-center justify-between px-5 fixed top-0 z-[9999] bg-[#fff9f6] shadow-md">
      {/* Logo */}
      <h1 className="text-3xl font-extrabold text-[#ff4d2d] tracking-wide">
        FoodHub 🍴
      </h1>

      {/* Desktop Search */}
      {userData?.role === "user" && (
        <div className="hidden md:flex md:w-[60%] lg:w-[40%] h-[60px] bg-white shadow-lg rounded-2xl items-center overflow-hidden">
          <div className="flex items-center gap-2 px-4 border-r border-gray-200">
            <FaLocationDot className="text-red-500" />
            <span className="truncate font-medium text-gray-600">
              {currentCity || "Detecting..."}
            </span>
          </div>
          <div className="flex items-center flex-1 px-4 gap-2">
            <IoSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full outline-none border-none text-gray-700 placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {/* Owner: Add Food Item */}
        {userData?.role === "owner" && myShopData && (
          <>
            <button
              className="hidden md:flex items-center gap-2 bg-[#ff4d2d] text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition"
              onClick={() => navigate("/add-food")}
            >
              <FaPlus /> <span>Add Food Item</span>
            </button>
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 bg-[#ff4d2d] text-white rounded-full shadow hover:bg-[#e63b1d] transition"
              onClick={() => navigate("/add-food")}
            >
              <FaPlus />
            </button>
          </>
        )}

        {/* Owner: Pending Orders */}
        {userData?.role === "owner" && (
          <>
            {/* Desktop */}
            <button
              className="hidden md:flex items-center gap-2 bg-[#ff4d2d] text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition relative"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 />
              <span>My Pending Order</span>
             
            </button>

            {/* Mobile */}
            <button
              className="md:hidden relative flex items-center justify-center w-10 h-10 bg-[#ff4d2d] text-white rounded-full shadow hover:bg-[#e63b1d] transition"
              onClick={() => navigate("/my-orders")}
            >
              <TbReceipt2 />
              
            </button>
          </>
        )}

        {/* User: Cart */}
        {userData?.role === "user" && (
          <div
            className="cursor-pointer relative hover:scale-110 transition-transform"
            onClick={() => navigate("/cart")}
          >
            <MdOutlineShoppingCart className="text-2xl text-gray-700" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          </div>
        )}

        {/* User / DeliveryBoy: My Orders (Desktop) */}
        {(userData?.role === "user" || userData?.role === "deliveryBoy") && (
          <button
            className="hidden md:block bg-[#ff4d2d] text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition"
            onClick={() => navigate("/my-orders")}
          >
            My Orders
          </button>
        )}

        {/* Profile */}
        <div className="relative">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#ff4d2d] text-white font-bold cursor-pointer hover:scale-110 transition"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            {userData?.fullName?.slice(0, 1)}
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg z-50 p-4">
              <p className="font-semibold text-gray-800">{userData?.fullName}</p>
              <p className="text-gray-500 text-xs mb-2">{userData?.email}</p>
              <hr className="my-2" />

              {/* Dropdown: My Orders for user/deliveryBoy */}
              {(userData?.role === "user" || userData?.role === "deliveryBoy") && (
                <button
                  className="md:hidden w-full bg-[#ff4d2d] text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition mb-2"
                  onClick={() => navigate("/my-orders")}
                >
                  My Orders
                </button>
              )}

              <button
                className="w-full text-left text-red-500 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Search Icon */}
        {userData?.role === "user" && (
          <div
            className="md:hidden cursor-pointer text-2xl text-gray-700"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <IoSearch />
          </div>
        )}
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && userData?.role === "user" && (
        <div className="absolute top-[80px] left-0 w-full bg-white shadow-lg flex items-center p-3 gap-2 md:hidden animate-slideDown z-[9999]">
          <FaLocationDot className="text-red-500" />
          <span className="text-gray-600">{currentCity || "Detecting..."}</span>
          <div className="flex items-center flex-1 px-4 gap-2">
            <IoSearch className="text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full outline-none border-none text-gray-700 placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Nav;
