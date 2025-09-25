import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { FaLeaf } from "react-icons/fa";
import { GiChickenLeg } from "react-icons/gi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { addToCart } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

// ------------------- Shimmer Cards -------------------
function ShimmerCard() {
  return (
    <div className="bg-gray-200 rounded-xl animate-pulse h-52 w-full"></div>
  );
}

function ShopShimmerCard() {
  return (
    <div className="min-w-[220px] sm:min-w-[250px] h-52 bg-gray-200 rounded-xl animate-pulse"></div>
  );
}

// ------------------- Shops Section -------------------
function ShopsSection({ shops, currentCity }) {
  const shopScrollRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const navigate = useNavigate();

  const scrollLeft = () =>
    shopScrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () =>
    shopScrollRef.current.scrollBy({ left: 250, behavior: "smooth" });

  useEffect(() => {
    setLoading(true);
    setTimeoutReached(false);

    const timer = setTimeout(() => {
      setTimeoutReached(true);
      setLoading(false);
    }, 5000); // 5 sec timeout

    if (shops && shops.length > 0) {
      setLoading(false);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [shops]);

  return (
    <div className="px-4 md:px-8 mt-10 relative">
      <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-6">
        Best shops in {currentCity}
      </h1>

      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
      >
        <FaChevronLeft />
      </button>

      <div
        ref={shopScrollRef}
        className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
      >
        {loading ? (
          [...Array(5)].map((_, i) => <ShopShimmerCard key={i} />)
        ) : shops && shops.length > 0 ? (
          shops.map((shop, idx) => (
            <div
              key={idx}
              className="min-w-[220px] sm:min-w-[250px] bg-white rounded-xl shadow hover:shadow-2xl transition cursor-pointer overflow-hidden"
              onClick={() => navigate(`/shop/${shop._id}`)}
            >
              <img
                src={shop.image}
                alt={shop.name}
                className="w-full h-36 sm:h-40 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-3">
                <h2 className="text-base font-semibold text-gray-800">
                  {shop.name}
                </h2>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {shop.address}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  📍 {shop.city}, {shop.state}
                </p>
              </div>
            </div>
          ))
        ) : timeoutReached ? (
          <p className="text-gray-500">Shop in your area is not found.</p>
        ) : null}
      </div>

      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

// ------------------- User Dashboard -------------------
function UserDashboard() {
  const dispatch = useDispatch();
  const {
    cartItems,
    userData,
    currentCity,
    shopsInMyCity,
    itemsInMyCity,
    searchItems,
  } = useSelector((state) => state.user);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);
  const categoryScrollRef = useRef(null);
  const [quantities, setQuantities] = useState({});

  const scrollLeft = (ref) =>
    ref.current.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = (ref) =>
    ref.current.scrollBy({ left: 250, behavior: "smooth" });

  const handleFilterByCategory = (category) => {
    if (category === "All") setUpdatedItemsList(itemsInMyCity);
    else {
      const filteredList = itemsInMyCity.filter((i) =>
        i.category?.toLowerCase().includes(category.toLowerCase())
      );
      setUpdatedItemsList(filteredList);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity);
  }, [itemsInMyCity]);

  const handleIncrease = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const handleDecrease = (id) =>
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="flex items-center justify-center">
        {searchItems && searchItems.length > 0 && (
          <div className="w-full max-w-6xl flex flex-col gap-5 items-center p-5 bg-white shadow-md rounded-2xl mt-4">
            <h1 className="text-xl font-semibold mb-3">Search Results</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {searchItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-3 right-3 z-10">
                    {item.foodType === "veg" ? (
                      <FaLeaf className="text-green-500 p-1 text-xl bg-white rounded-full shadow" />
                    ) : (
                      <GiChickenLeg className="text-red-600 p-1 text-xl bg-white rounded-full shadow" />
                    )}
                  </div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-36 sm:h-40 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-base font-semibold text-gray-800 truncate">
                      {item.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      {item.shop?.image && (
                        <img
                          src={item.shop.image}
                          alt={item.shop.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      )}
                      <p className="text-xs text-gray-500 truncate">
                        {item.shop?.name}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {item.category}
                    </p>
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      ₹{item.price}
                    </p>

                    <div className="flex items-center justify-between mt-2 border rounded-xl px-3 py-1 bg-gray-50 hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600"
                          onClick={() => handleIncrease(item._id)}
                        >
                          <FaPlus />
                        </button>
                        <span className="w-6 text-center">
                          {quantities[item._id] || 0}
                        </span>
                        <button
                          className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600"
                          onClick={() => handleDecrease(item._id)}
                        >
                          <FaMinus />
                        </button>
                      </div>

                      <button
                        className={`${
                          cartItems.some((i) => i.id === item._id)
                            ? "bg-gray-800"
                            : "bg-orange-600"
                        } text-white text-xl transition-colors px-3 py-2`}
                        onClick={() =>
                          (quantities[item._id] || 0) > 0 &&
                          dispatch(
                            addToCart({
                              id: item._id,
                              name: item.name,
                              price: item.price,
                              image: item.image,
                              shop: item.shop,
                              quantity: quantities[item._id],
                              foodType: item.foodType,
                            })
                          )
                        }
                      >
                        <FaCartShopping size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) =>
                        i < Math.round(item.rating?.average || 0) ? (
                          <FaStar key={i} className="text-yellow-400" />
                        ) : (
                          <CiStar key={i} className="text-gray-300" />
                        )
                      )}
                      <span className="text-xs text-gray-400 ml-1">
                        ({item.rating?.count || 0})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Categories */}
      <div className="px-4 md:px-8 mt-6 relative">
        <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-6">
          Inspiration for your first order
        </h1>
        <button
          onClick={() => scrollLeft(categoryScrollRef)}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <FaChevronLeft />
        </button>

        <div
          ref={categoryScrollRef}
          className="flex gap-3 md:gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {categories.map((cate, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CategoryCard
                data={cate}
                isHovered={hoveredIndex === index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollRight(categoryScrollRef)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-100"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Shops */}
      <ShopsSection shops={shopsInMyCity} currentCity={currentCity} />

      {/* Items */}
      <div className="px-4 md:px-8 mt-10">
        <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-6">
          Suggested Food Items
        </h1>
        {updatedItemsList && updatedItemsList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-10">
            {updatedItemsList.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-3 right-3 z-10">
                  {item.foodType === "veg" ? (
                    <FaLeaf className="text-green-500 p-1 text-xl bg-white rounded-full shadow" />
                  ) : (
                    <GiChickenLeg className="text-red-600 p-1 text-xl bg-white rounded-full shadow" />
                  )}
                </div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-36 sm:h-40 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-800 truncate">
                    {item.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {item.shopLogo && (
                      <img
                        src={item.shopLogo}
                        alt={item.shopName}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    )}
                    <p className="text-xs text-gray-500 truncate">
                      {item.shopName}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {item.category}
                  </p>
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center justify-between mt-2 border rounded-xl px-3 py-1 bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600"
                        onClick={() => handleIncrease(item._id)}
                      >
                        <FaPlus />
                      </button>
                      <span className="w-6 text-center">
                        {quantities[item._id] || 0}
                      </span>
                      <button
                        className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600"
                        onClick={() => handleDecrease(item._id)}
                      >
                        <FaMinus />
                      </button>
                    </div>

                    <button
                      className={`${
                        cartItems.some((i) => i.id === item._id)
                          ? "bg-gray-800"
                          : "bg-orange-600"
                      } text-white text-xl transition-colors px-3 py-2`}
                      onClick={() =>
                        (quantities[item._id] || 0) > 0
                          ? dispatch(
                              addToCart({
                                id: item._id,
                                name: item.name,
                                price: item.price,
                                image: item.image,
                                shop: item.shop,
                                quantity: quantities[item._id],
                                foodType: item.foodType,
                              })
                            )
                          : null
                      }
                    >
                      <FaCartShopping size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) =>
                      i < Math.round(item.rating.average) ? (
                        <FaStar key={i} className="text-yellow-400" />
                      ) : (
                        <CiStar key={i} className="text-gray-300" />
                      )
                    )}
                    <span className="text-xs text-gray-400 ml-1">
                      ({item.rating.count})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ShimmerCard key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
