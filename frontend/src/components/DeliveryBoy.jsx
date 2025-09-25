import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function DeliveryBoy() {
  const { userData, socket } = useSelector((state) => state.user);
  const [assignments, setAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);

  // 🔹 Loading states
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loadingVerifyOtp, setLoadingVerifyOtp] = useState(false);

  useEffect(() => {
    if (!socket || userData !== "deliveryBoy") {
      return;
    }
    let watchId;
    if (navigator.geolocation) {
      (watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDeliveryBoyLocation({ lat: latitude, lon: longitude });
        socket.emit("updateLocation", {
          userId: userData._id,
          latitude,
          longitude,
        });
      })),
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        };
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [socket, userData]);

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAssignments(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const acceptOrder = async (assignmentId) => {
    setLoadingAccept(true);
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, {
        withCredentials: true,
      });
      await getCurrentOrder();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingAccept(false);
    }
  };

  const sendOtp = async () => {
    setLoadingSendOtp(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        {
          withCredentials: true,
        }
      );

      setShowOtpBox(true);
      console.log(result.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingSendOtp(false);
    }
  };

  const verifyOtp = async () => {
    setLoadingVerifyOtp(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        {
          withCredentials: true,
        }
      );
      console.log(result.data);
      navigate(-1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingVerifyOtp(false);
    }
  };

  // today earning of Delivery Boy
  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        {
          withCredentials: true,
        }
      );
      console.log(result.data);
      setTodayDeliveries(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userData) {
      getAssignments();
      getCurrentOrder();
      handleTodayDeliveries();
    }
  }, [userData]);

  useEffect(() => {
    socket?.on("newAssigment", (data) => {
      if (data.sentTo == userData._id) {
        setAssignments((prev) => [...prev, data]);
      }
    });

    return () => {
      socket?.off("newAssigment");
    };
  }, [socket]);

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );
  const totalCount = todayDeliveries.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* User Info */}
        <div className="bg-white border p-4 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {userData?.fullName}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            📍 Lat: {userData?.location?.coordinates?.[1]} | Lon:{" "}
            {userData?.location?.coordinates?.[0]}
          </p>
        </div>

        {!currentOrder && (
          <>
            {/* Assignments Section */}
            <h2 className="text-xl font-semibold text-gray-700">
              📦 My Assignments
            </h2>
            {assignments.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {assignments.map((a) => (
                  <div
                    key={a.assignmentId}
                    className="bg-white border p-4 rounded-xl shadow hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800">{a.shopName}</h3>
                      <span className="text-xs text-gray-500">
                        #{a.assignmentId.slice(-5)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      🆔 Order: {a.orderId}
                    </p>
                    <p className="text-gray-600 text-sm">
                      📍 {a.deliveryAddress.text}
                    </p>
                    <p className="text-gray-800 font-semibold mt-1">
                      💰 <span className="text-green-600">₹{a.subtotal}</span>
                    </p>

                    <div className="mt-2">
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">
                        🛒 Items
                      </h4>
                      <ul className="list-disc list-inside text-gray-700 text-xs space-y-1 max-h-24 overflow-y-auto">
                        {a.items.map((item) => (
                          <li key={item._id}>
                            {item.name} — ₹{item.price} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="mt-3 w-full bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 transition disabled:opacity-50"
                      onClick={() => acceptOrder(a.assignmentId)}
                      disabled={loadingAccept}
                    >
                      {loadingAccept ? "Accepting..." : "Accept"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No assignments found.</p>
            )}
          </>
        )}

        <div className="bg-white rounded-2xl shadow-md p-4 w-[90%] mb-6 border">
          <h1 className="text-lg font-bold mb-3 text-orange-600">
            📊 Today Deliveries
          </h1>

          {/* Chart Of Earning*/}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>

          {/* Earnings & Deliveries Summary */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
              <p className="text-sm text-gray-600">🚚 Total Deliveries</p>
              <span className="text-xl font-bold text-gray-800">
                {totalCount}
              </span>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
              <p className="text-sm text-gray-600">💰 Today’s Earning</p>
              <span className="text-xl font-bold text-green-700">
                ₹{totalEarning}
              </span>
            </div>
          </div>
        </div>

        {currentOrder && (
          <div className="bg-white border p-4 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              🚚 Current Order
            </h2>

            {/* Customer Info */}
            <div className="text-sm text-gray-700 space-y-1">
              <p>👤 Name: {currentOrder.user.fullName}</p>
              <p>Email: {currentOrder.user.email}</p>
              <p>Mobile: {currentOrder.user.mobileNumber}</p>
              <p>
                Location: 📍 Lat {currentOrder.user.location.coordinates[1]},
                Lon {currentOrder.user.location.coordinates[0]}
              </p>
            </div>

            {/* Delivery Address */}
            <div className="text-sm text-gray-700 space-y-1">
              <p>📍 Delivery Address: {currentOrder.deliveryAddress.text}</p>
              <p>
                Lat: {currentOrder.deliveryAddress.latitude}, Lon:{" "}
                {currentOrder.deliveryAddress.longitude}
              </p>
            </div>

            {/* Shop Order */}
            <div className="text-sm text-gray-700 space-y-1">
              <p>🏬 Shop ID: {currentOrder.shopOrder.shop}</p>
              <p>Owner ID: {currentOrder.shopOrder.owner}</p>
              <p>Status: {currentOrder.shopOrder.status}</p>
              <p className="font-semibold text-gray-800">
                💰 Subtotal: ₹{currentOrder.shopOrder.subTotal}
              </p>
            </div>

            {/* Items */}
            <div className="text-sm text-gray-700">
              <h4 className="font-semibold mb-1">🛒 Items</h4>
              <ul className="list-disc list-inside space-y-1 max-h-28 overflow-y-auto">
                {currentOrder.shopOrder.shopOrderItems.map((item) => (
                  <li key={item._id}>
                    {item.name} — ₹{item.price} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p>
                  📍 Delivery Boy: Lat {currentOrder.deliveryBoyLocation.lat},
                  Lon {currentOrder.deliveryBoyLocation.lon}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p>
                  📍 Customer: Lat {currentOrder.customerLocation.lat}, Lon{" "}
                  {currentOrder.customerLocation.lon}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="h-64 rounded-lg overflow-hidden shadow-sm">
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation: deliveryBoyLocation || {
                    lat: userData.location.coordinates[1],
                    lon: userData.location.coordinates[0],
                  },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>

            {/* OTP Section */}
            {!showOtpBox ? (
              <button
                onClick={sendOtp}
                disabled={loadingSendOtp}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-700 hover:scale-105 transition font-semibold disabled:opacity-50"
              >
                {loadingSendOtp ? "Sending OTP..." : "Mark As Delivered"}
              </button>
            ) : (
              <div className="flex flex-col space-y-2">
                <p className="text-gray-700 text-center">
                  Enter OTP sent to{" "}
                  <span className="font-semibold">
                    {currentOrder.user.fullName}
                  </span>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
                <button
                  disabled={loadingVerifyOtp}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-700 hover:scale-105 transition font-semibold disabled:opacity-50"
                  onClick={verifyOtp}
                >
                  {loadingVerifyOtp ? "Verifying..." : "Submit OTP"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
