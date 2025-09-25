import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
import { serverUrl } from "../App.jsx";

function AddItem() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false); // 🔹 loading state

  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔹 start loading
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      if (backendImage) formData.append("image", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(result.data));
      console.log(result.data);
      navigate("/"); // 🔹 redirect after success
    } catch (error) {
      console.error("Error while submitting food:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false); // 🔹 stop loading (even on error)
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#ff4d2d] hover:text-[#e63b1d] transition"
        >
          <IoIosArrowRoundBack className="text-3xl" />
        </button>
      </div>

      {/* Card */}
      <div className="flex justify-center items-center p-6 mt-5">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-full mb-4 mx-auto">
            <FaUtensils className="text-3xl" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {"Add Your Food"}
          </h2>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Food Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Name
              </label>
              <input
                type="text"
                placeholder="Enter Food Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
              />
            </div>

            {/* Food Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Price
              </label>
              <input
                type="number"
                placeholder="Enter Food Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
              />
            </div>

            {/* Food Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Food Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="veg"
                    checked={foodType === "veg"}
                    onChange={(e) => setFoodType(e.target.value)}
                  />
                  Veg
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="non veg"
                    checked={foodType === "non veg"}
                    onChange={(e) => setFoodType(e.target.value)}
                  />
                  Non-Veg
                </label>
              </div>
            </div>

            {/* Food Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none"
              />
              {frontendImage && (
                <div className="mt-4">
                  <img
                    src={frontendImage}
                    alt="Food Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading} // 🔹 disable when loading
              className={`w-full py-3 rounded-xl font-semibold shadow transition duration-200 ${
                loading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-[#ff4d2d] text-white hover:bg-[#e63b1d]"
              }`}
            >
              {loading ? "Saving..." : "Add Food"} {/* 🔹 button text */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
