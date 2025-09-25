import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  FaStore,
  FaUser,
  FaMoneyBillWave,
  FaTruck,
  FaBoxOpen,
  FaMapMarkerAlt,
} from "react-icons/fa";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentOrder, setCurrentOrder] = useState();
  const {socket} = useSelector(state=>state.user);
  const [liveLocations,setLiveLocations] = useState({});

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    socket.on('updateDeliveryLocation',({deliveryBoyId,latitude,longitude})=>{
      setLiveLocations(prev=>({
        ...prev,
        [deliveryBoyId]:{lat:latitude,lon:longitude}
      }))
    })
  },[socket])

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#ff4d2d] hover:text-[#e63b1d] transition"
        >
          <IoIosArrowRoundBack className="text-3xl" />
          <span className="ml-2 text-lg font-medium">Back</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Track Order</h1>

      {currentOrder ? (
        currentOrder.shopOrders.map((shopOrder, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-md mb-4 max-w-xl mx-auto"
          >
            {/* Shop Info */}
            <div className="flex items-center mb-2 text-gray-800">
              <FaStore className="mr-2 text-orange-500" />
              <h2 className="text-lg font-semibold">{shopOrder?.shop?.name}</h2>
            </div>

            <div className="text-gray-600 text-sm mb-2 space-y-1">
              <p>
                <FaUser className="inline mr-1" />
                Owner ID: {shopOrder?.owner}
              </p>
              <p>
                <FaTruck className="inline mr-1" />
                Status: {shopOrder?.status}
              </p>
              <p className="text-green-600 font-semibold">
                <FaMoneyBillWave className="inline mr-1" />₹{shopOrder?.subTotal}
              </p>
            </div>

            {/* Items */}
            <div className="mb-2">
              <h3 className="flex items-center text-gray-700 font-semibold mb-1 text-sm">
                <FaBoxOpen className="mr-1 text-blue-500" /> Items
              </h3>
              <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 max-h-28 overflow-y-auto">
                {shopOrder?.shopOrderItems?.map((item) => (
                  <li key={item._id}>
                    <span className="font-medium">{item.name}</span> — ₹
                    {item.price} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Assigned Delivery Boy */}
            {shopOrder.status !== "delivered" &&
              shopOrder?.assignedDeliveryBoy && (
                <div className="mb-2 text-sm">
                  <h4 className="flex items-center text-gray-700 font-semibold mb-1">
                    <FaTruck className="mr-1 text-purple-500" /> Delivery Boy
                  </h4>
                  <p>
                    {shopOrder.assignedDeliveryBoy.fullName} —{" "}
                    {shopOrder.assignedDeliveryBoy.mobileNumber}
                  </p>
                </div>
              )}

            {/* Delivered Badge */}
            {shopOrder.status === "delivered" && (
              <div className="bg-green-100 text-green-800 p-2 rounded-lg text-center font-semibold mb-2 text-sm">
                ✅ Order Delivered
              </div>
            )}

            {/* Customer Info */}
            <div className="mb-2 text-sm">
              <h4 className="flex items-center text-gray-700 font-semibold mb-1">
                <FaUser className="mr-1 text-green-500" /> Customer
              </h4>
              <p>{currentOrder.user.fullName}</p>
              <p>{currentOrder.user.email}</p>
              <p>{currentOrder.user.mobileNumber}</p>
            </div>

            {/* Delivery Address */}
            <div className="mb-2 text-sm">
              <h4 className="flex items-center text-gray-700 font-semibold mb-1">
                <FaMapMarkerAlt className="mr-1 text-red-500" /> Delivery Address
              </h4>
              <p>{currentOrder.deliveryAddress.text}</p>
              <p className="text-gray-500 text-xs">
                Lat: {currentOrder.deliveryAddress.latitude}, Lon:{" "}
                {currentOrder.deliveryAddress.longitude}
              </p>
            </div>

            {/* Delivery Map */}
            {shopOrder.status !== "delivered" && shopOrder.assignedDeliveryBoy && (
              <div className="h-64 mt-2 rounded-lg overflow-hidden shadow-sm">
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                      lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                      lon: shopOrder.assignedDeliveryBoy.location.coordinates[0],
                    },
                    customerLocation: {
                      lat: currentOrder.deliveryAddress.latitude,
                      lon: currentOrder.deliveryAddress.longitude,
                    },
                  }}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">Loading order details...</p>
      )}
    </div>
  );
}

export default TrackOrderPage;
