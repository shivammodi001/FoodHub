import React from "react";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { FaUtensils, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import OwnerItemCard from "./OwnerItemCard";

function OwnerDashboard() {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff9f6]">
      <Nav />

      {/* Add Restaurant Card */}
      {!myShopData && (
        <div className="flex justify-center items-center px-4 mt-24">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-full mx-auto mb-4">
              <FaUtensils className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Add Your Restaurant
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Join our platform and reach thousands of customers every day.
              Start growing your business 🚀
            </p>
            <button
              className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition duration-200"
              onClick={() => navigate("/create-edit-shop")}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Welcome Heading */}
      {myShopData && (
        <div className="text-center mt-20 mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <FaUtensils className="text-[#ff4d2d] text-3xl" />

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Welcome to {myShopData.name}
          </h1>
        </div>
      )}

      {/* Shop Details + Add Food Card */}
      {myShopData && (
        <div className="flex flex-col items-center px-4 mb-12 gap-8">
          {/* Shop Details */}
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            {myShopData.image && (
              <div className="relative">
                <img
                  src={myShopData.image}
                  alt={myShopData.name}
                  className="w-full h-64 md:h-72 object-cover"
                />
                <button
                  onClick={() => navigate("/create-edit-shop")}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
                >
                  <FaEdit className="text-[#ff4d2d]" />
                </button>
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {myShopData.name}
              </h2>
              <p className="text-gray-600 mb-1">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-gray-600">{myShopData.address}</p>
            </div>
          </div>

          {/* Add Food Card */}
          {myShopData.items.length === 0 && (
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-[#ff4d2d]/10 text-[#ff4d2d] rounded-full mx-auto mb-4">
                <FaUtensils className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Add Your Food Item
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Share your delicious creations with our customers by adding them
                to the menu.
              </p>
              <button
                className="w-full bg-[#ff4d2d] text-white py-3 rounded-xl font-semibold shadow hover:bg-[#e63b1d] transition duration-200"
                onClick={() => navigate("/add-food")}
              >
                Add Food
              </button>
            </div>
          )}

          {myShopData.items.length > 0 && (
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {myShopData.items.map((item, index) => {
                return <OwnerItemCard data={item} key={index} />;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
