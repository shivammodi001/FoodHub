import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
import { serverUrl } from "../App.jsx";

function CreateEditShop() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );

  // States
  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || ""
  );
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null);
  const [backendImage, setBackendImage] = useState(null);
  const [loading, setLoading] = useState(false); // 👈 loading state add kiya

  const dispatch = useDispatch();

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(result.data));
      console.log(result.data);

      navigate("/"); // redirect after submit
    } catch (error) {
      console.error("Error while submitting shop:", error);
      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      {/* Back Icon in Corner */}
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#ff4d2d] hover:text-[#e63b1d] transition"
        >
          <IoIosArrowRoundBack className="text-3xl" />
        </button>
      </div>

      {/* Card Centered */}
      <div className="flex justify-center items-center p-6 mt-[20px]">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-full mb-4 mx-auto">
            <FaUtensils className="text-3xl" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {myShopData ? "Edit Your Restaurant" : "Add Your Restaurant"}
          </h2>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                type="text"
                placeholder="Enter Shop Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Shop Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none disabled:opacity-50"
              />
              {frontendImage && (
                <div className="mt-4">
                  {loading ? (
                    <div className="w-full h-48 rounded-lg border animate-pulse bg-gray-200" />
                  ) : (
                    <img
                      src={frontendImage}
                      alt=""
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  )}
                </div>
              )}
            </div>

            {/* State + City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  placeholder="Enter State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Address
              </label>
              <input
                type="text"
                placeholder="Enter Shop Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#ff4d2d] focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : myShopData
                ? "Save Changes"
                : "Add Shop"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateEditShop;
