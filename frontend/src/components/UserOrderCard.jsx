import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});

  // Initialize rating from item data
  useEffect(() => {
    const initialRatings = {};
    data.shopOrders.forEach((shopOrder) => {
      shopOrder.shopOrderItems.forEach((item) => {
        if (item.item.rating?.average) {
          initialRatings[item.item._id] = Math.round(item.item.rating.average);
        }
      });
    });
    setSelectedRating(initialRatings);
  }, [data]);

  const handleRating = async (itemId, rating) => {
    console.log("Clicked item:", itemId, "Rating:", rating);

    // Optimistic UI update
    setSelectedRating((prev) => ({ ...prev, [itemId]: rating }));

    try {
      const result = await axios.post(
        `${serverUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );
      console.log("Rating saved:", result.data);
    } catch (error) {
      console.log("Rating error:", error.response?.data || error.message);
      // Revert rating if error
      setSelectedRating((prev) => {
        const copy = { ...prev };
        copy[itemId] = 0; // ya previous value save karke wapas daal sakte ho
        return copy;
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <p className="text-sm text-gray-500">Order #{data._id.slice(-6)}</p>
          <p className="text-gray-600 text-xs">
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          {data?.paymentMethod === "online" ? (
            <p className="font-medium text-gray-600">
              payment: {data.payment ? "true" : "false"}
            </p>
          ) : (
            <p className="flex items-center gap-2 font-medium text-gray-600">
              Payment Method: {data?.paymentMethod}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-orange-500">
            ₹{data.totalAmount}
          </p>
        </div>
      </div>

      {/* Shop Orders */}
      <div className="space-y-4">
        {data.shopOrders.map((shopOrder, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-gray-50 space-y-3"
          >
            {/* Shop Name & Status */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-700 text-lg">
                {shopOrder.shop.name}
              </p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  shopOrder.status === "pending"
                    ? "bg-red-100 text-red-700"
                    : shopOrder.status === "preparing"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {shopOrder.status}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {shopOrder.shopOrderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm hover:bg-orange-50 transition"
                >
                  <img
                    src={item.item.image}
                    alt={item.item.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </p>

                  {/* Rating */}
                  {shopOrder.status === "delivered" && (
                    <div className="flex space-x-1 cursor-pointer">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleRating(item.item._id, star)}
                          className={`text-2xl ${
                            selectedRating[item.item._id] >= star
                              ? "text-yellow-400"
                              : "text-gray-400"
                          } hover:text-yellow-300 transition`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <p className="text-right font-bold text-gray-800 mt-2">
              Subtotal: ₹{shopOrder.subTotal}
            </p>
          </div>
        ))}
      </div>

      {/* Track Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => navigate(`/track-order/${data._id}`)}
          className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          Track Order
        </button>
      </div>

      {/* Delivery & Payment */}
      <div className="pt-3 border-t space-y-1">
        <p className="text-gray-700 font-medium">
          <span className="font-semibold">Delivery Address:</span>{" "}
          {data.deliveryAddress.text}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Payment Method:</span>{" "}
          {data.paymentMethod.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

export default UserOrderCard;
