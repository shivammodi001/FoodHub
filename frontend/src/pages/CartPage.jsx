import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../redux/userSlice"; // <-- path sahi rakho

function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  // console.log(cartItems);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#fff9f6] relative p-6">
      {/* back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-[#ff4d2d] hover:text-[#e63b1d] transition"
      >
        <IoIosArrowRoundBack className="text-3xl" />
      </button>

      {/* main content */}
      <div className="w-full max-w-[800px] mx-auto flex flex-col min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 text-center py-6">
          Your Cart
        </h1>

        {cartItems.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => dispatch(clearCart())}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              Clear Cart
            </button>
          </div>
        )}

        <div className="flex-1">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your Cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-lg">{item.name}</h2>
                      <p className="text-sm text-gray-500">
                        {item.foodType}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, type: "decrease" }))
                          }
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          onClick={() =>
                            dispatch(updateQuantity({ id: item.id, type: "increase" }))
                          }
                          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-[#ff4d2d]">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
                    >
                      <FaTrashAlt size={16} className="text-orange-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="bg-white p-4 rounded-2xl shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Total Amount</h2>
              <p className="text-xl font-bold text-[#ff4d2d]">₹{totalAmount}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/checkout")}
                className="bg-[#ff4d2d] text-white px-6 py-2 rounded-lg shadow hover:bg-[#e63b1d] transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;
