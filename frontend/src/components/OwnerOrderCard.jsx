import React, { useState } from "react";
import { FaPhoneAlt, FaRegUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa6";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "../redux/userSlice";

function OwnerOrderCard({ data }) {
  const shopOrder = data?.shopOrders;
  const [status, setStatus] = useState(shopOrder?.status || "pending");
  const dispatch = useDispatch();
  const [availableBoys, setAvailableBoys] = useState([]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      setStatus(newStatus);
      const result = await axios.post(
        `${serverUrl}/api/order/update-status/${data._id}/${shopOrder?.shop?._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      dispatch(
        updateOrderStatus({
          orderId: data._id,
          shopId: shopOrder?.shop?._id,
          status: newStatus,
        })
      );
      setAvailableBoys(result.data.availableBoys);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 hover:shadow-2xl transition transform hover:scale-105">
      {/* User Info */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FaRegUser className="text-orange-400" /> {data?.user?.fullName}
        </h2>
        <p className="flex items-center gap-2 text-gray-500">
          <MdEmail className="text-orange-400" /> {data?.user?.email}
        </p>
        <p className="flex items-center gap-2 text-gray-500">
          <FaPhoneAlt className="text-orange-400" /> {data?.user?.mobileNumber}
        </p>
      </div>

      {/* Delivery Info */}
      <div className="border-t pt-3 space-y-1">
        <p className="flex items-center gap-2 font-medium text-gray-600">
          <FaRegAddressCard className="text-orange-400" /> Address: {data?.deliveryAddress?.text}
        </p>
        {data?.paymentMethod == "online" ? <p className="font-medium text-gray-600">payment: {data.payment?"true":"false"}</p> : <p className="flex items-center gap-2 font-medium text-gray-600">Payment Method: {data?.paymentMethod}</p>}
        
        <p className="text-gray-500 text-sm">Lat: {data?.deliveryAddress?.latitude}</p>
        <p className="text-gray-500 text-sm">Lng: {data?.deliveryAddress?.longitude}</p>
      </div>

      {/* Shop Order */}
      {shopOrder && (
        <div className="border-t pt-3 space-y-4">
          <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-700 text-lg">{shopOrder?.shop?.name}</p>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  status === "pending"
                    ? "bg-red-100 text-red-600"
                    : status === "preparing"
                    ? "bg-yellow-100 text-yellow-600"
                    : status === "out of delivery"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {status}
              </span>
            </div>

            {/* Items */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {shopOrder?.shopOrderItems?.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm hover:bg-orange-50 transition"
                >
                  <img
                    src={item?.item?.image}
                    alt={item?.item?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item?.item?.name}</p>
                    <p className="text-gray-500 text-sm">
                      ₹{item?.item?.price} × {item?.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-700">
                    ₹{item?.item?.price * item?.quantity}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-right font-bold text-gray-800 mt-2">Total: ₹{shopOrder?.subTotal}</p>
          </div>

          {/* Status Change */}
          <div className="flex justify-between items-center border-t pt-3">
            <span className="font-medium text-gray-700">Change Status:</span>
            <select
              value={status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="out of delivery">Out Of Delivery</option>
            </select>
          </div>

          {/* Delivery Boys */}
          {status === "out of delivery" && (
            <div className="border-t pt-3 space-y-3">
              <p className="font-medium text-gray-700 text-lg">
                {shopOrder?.assignedDeliveryBoy ? "Assigned To:" : "Available Delivery Boys:"}
              </p>
              {(availableBoys.length > 0
                ? availableBoys
                : shopOrder?.assignedDeliveryBoy
                ? [shopOrder.assignedDeliveryBoy]
                : []
              ).map((b, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-lg border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-2 hover:bg-orange-50 transition"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaRegUser className="text-orange-500" /> {b.fullName}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <FaPhoneAlt className="text-orange-500" /> {b.mobile || b.mobileNumber}
                    </p>
                  </div>
                </div>
              ))}
              {availableBoys.length === 0 && !shopOrder?.assignedDeliveryBoy && (
                <p className="text-gray-500 font-medium">No delivery boys available</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerOrderCard;
