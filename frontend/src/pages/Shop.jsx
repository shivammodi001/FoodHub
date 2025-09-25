import axios from "axios";
import React, { useEffect, useState } from "react";
import { serverUrl } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaStore, FaUtensils, FaPlus, FaMinus, FaLeaf, FaStar, FaShoppingCart } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { GiChickenLeg } from "react-icons/gi";
import { CiStar } from "react-icons/ci";
import { IoIosArrowRoundBack } from "react-icons/io";
import { addToCart } from "../redux/userSlice";

// ------------------- Shimmer Card -------------------
function ShimmerCard() {
  return <div className="bg-gray-200 rounded-xl animate-pulse h-52 w-full"></div>;
}

function Shop() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);

  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  const handleIncrease = (id) => setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const handleDecrease = (id) => setQuantities(prev => ({ ...prev, [id]: prev[id] > 0 ? prev[id] - 1 : 0 }));

  const fetchShopItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/item/get-items-by-shop/${shopId}`, { withCredentials: true });
      setShop(res.data?.shop || null);
      setItems(res.data?.items || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopItems();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-4 text-gray-700 hover:text-gray-900 font-semibold"
      >
        <IoIosArrowRoundBack size={30} color="red" />
      </button>

      {/* Shop Header */}
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8">
          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4 rounded-xl">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">{shop.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <FaLocationDot size={22} color="red" />
              <p className="text-lg font-medium mt-[10px] text-gray-200 drop-shadow-lg">{shop.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
          <FaUtensils color="red" /> Our Menu
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <ShimmerCard key={i} />)}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item._id} className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden">
                <div className="absolute top-3 right-3 z-10">
                  {item.foodType === "veg" ? (
                    <FaLeaf className="text-green-500 p-1 text-xl bg-white rounded-full shadow" />
                  ) : (
                    <GiChickenLeg className="text-red-600 p-1 text-xl bg-white rounded-full shadow" />
                  )}
                </div>
                <img src={item.image} alt={item.name} className="w-full h-36 sm:h-40 object-cover transition-transform duration-300 hover:scale-105" />
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-800 truncate">{item.name}</h2>
                  <div className="flex items-center gap-2">
                    {item.shopLogo && <img src={item.shopLogo} alt={item.shopName} className="w-5 h-5 rounded-full object-cover" />}
                    <p className="text-xs text-gray-500 truncate">{item.shopName}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{item.category}</p>
                  <p className="text-sm text-green-600 font-semibold mt-1">₹{item.price}</p>

                  <div className="flex items-center justify-between mt-2 border rounded-xl px-3 py-1 bg-gray-50 hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                      <button className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600" onClick={() => handleIncrease(item._id)}><FaPlus /></button>
                      <span className="w-6 text-center">{quantities[item._id] || 0}</span>
                      <button className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-600" onClick={() => handleDecrease(item._id)}><FaMinus /></button>
                    </div>

                    <button
                      className={`${cartItems.some((i) => i.id === item._id) ? "bg-gray-800" : "bg-orange-600"} text-white text-xl transition-colors px-3 py-2`}
                      onClick={() => (quantities[item._id] || 0) > 0 ? dispatch(addToCart({ id: item._id, name: item.name, price: item.price, image: item.image, shop: item.shop, quantity: quantities[item._id], foodType: item.foodType })) : null}
                    >
                      <FaShoppingCart size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) =>
                      i < Math.round(item.rating?.average || 0) ? <FaStar key={i} className="text-yellow-400" /> : <CiStar key={i} className="text-gray-300" />
                    )}
                    <span className="text-xs text-gray-400 ml-1">({item.rating?.count || 0})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No items found in this shop.</p>
        )}
      </div>
    </div>
  );
}

export default Shop;
