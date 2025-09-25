import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ImLocation } from "react-icons/im";
import { TbCurrentLocation } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { setLocaion, setAddress } from "../redux/mapSlice";
import { MdDeliveryDining, MdOutlinePayment } from "react-icons/md";
import { addMyOrder, clearCart } from "../redux/userSlice";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { serverUrl } from "../App";

// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper component to auto move map on coords change
function ChangeMapView({ coords }) {
  const map = useMapEvents({});
  useEffect(() => {
    if (coords.lat && coords.lon) {
      map.setView([coords.lat, coords.lon], 16, { animate: true });
    }
  }, [coords, map]);
  return null;
}

// Draggable marker component
function DraggableMarker({ coords, setCoords, setLocalAddress, dispatch }) {
  const eventHandlers = {
    dragend: async (e) => {
      const { lat, lng } = e.target._latlng;
      setCoords({ lat, lon: lng });
      dispatch(setLocaion({ lat, lon: lng }));

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        if (data?.display_name) {
          setLocalAddress(data.display_name);
          dispatch(setAddress(data.display_name));
        }
      } catch (err) {
        console.error(err);
      }
    },
  };

  return (
    <Marker
      position={[coords.lat, coords.lon]}
      draggable
      eventHandlers={eventHandlers}
    >
      <Popup>Delivery Location</Popup>
    </Marker>
  );
}

function CheckOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, userData } = useSelector((state) => state.user);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [localAddress, setLocalAddress] = useState("");
  const [coords, setCoords] = useState({
    lat: location?.lat || 28.6139,
    lon: location?.lon || 77.209,
  });

  // Initialize input with user's current address if available
  useEffect(() => {
    if (address) setLocalAddress(address);
  }, [address]);

  useEffect(() => {
    if (location.lat && location.lon) {
      setCoords({ lat: location.lat, lon: location.lon });
    }
  }, [location]);

  const handlePlaceOrder = async () => {
    try {
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const result = await axios.post(
        `${serverUrl}/api/order/place-order`,
        {
          paymentMethod,
          deliveryAddress: {
            text: localAddress,
            latitude: location?.lat,
            longitude: location?.lon,
          },
          totalAmount,
          cartItems,
        },
        { withCredentials: true }
      );

      if (paymentMethod == "cod") {
        if (result.data) {
          alert("✅ Order placed successfully!");
          dispatch(addMyOrder(result.data));
          dispatch(clearCart());
          navigate("/order-placed");
        }
      } else {
        //online method
        const orderId = result.data.orderId;
        const razorOrder = result.data.razorOrder;
        // console.log(orderId," ",razorOrder);
        openRazorpayWindow(orderId, razorOrder);
      }
    } catch (err) {
      console.error("Order failed", err);
      alert("❌ Currently this is feature not working, Sorry for that.");
    }
  };

  const openRazorpayWindow = (orderId, razorOrder) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: "INR",
      name: "FoodHub",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true }
          );

          alert("✅ Order placed successfully!");
          dispatch(addMyOrder(result.data));
          dispatch(clearCart());
          navigate("/my-orders");

        } catch (error) {
          console.error("Order failed", err);
          alert("❌ Order failed, try again");
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Current location button using userData
  const getCurrentLocation = async () => {
    if (userData?.location?.coordinates) {
      const lat = userData.location.coordinates[1];
      const lon = userData.location.coordinates[0];
      setCoords({ lat, lon });

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await res.json();
        if (data?.display_name) {
          setLocalAddress(data.display_name);
          dispatch(setAddress(data.display_name));
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("User location not available");
    }
  };

  // Search button
  const handleAddressSearch = async () => {
    if (!localAddress) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          localAddress
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoords({ lat: parseFloat(lat), lon: parseFloat(lon) });
        dispatch(setLocaion({ lat: parseFloat(lat), lon: parseFloat(lon) }));
        dispatch(setAddress(localAddress));
      } else {
        alert("Address not found!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fff9f6] p-6">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 flex items-center text-[#ff4d2d] hover:text-[#e63b1d] transition"
      >
        <IoIosArrowRoundBack className="text-3xl" />
      </button>

      <div className="w-full max-w-[800px] mx-auto flex flex-col min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 text-center py-6">
          Check-Out
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
          <h2 className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
            <ImLocation /> Delivery Location
          </h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter Your Delivery Address"
              value={localAddress}
              onChange={(e) => setLocalAddress(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#ff4d2d]"
            />
            <button
              onClick={handleAddressSearch}
              className="p-3 bg-[#ff4d2d] text-white rounded-xl hover:bg-[#e63b1d] transition"
            >
              <IoSearch className="text-lg" />
            </button>
            <button
              onClick={getCurrentLocation}
              className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition"
            >
              <TbCurrentLocation className="text-lg" />
            </button>
          </div>

          <div className="w-full h-64 rounded-xl overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={13}
              scrollWheelZoom
              className="w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <DraggableMarker
                coords={coords}
                setCoords={setCoords}
                setLocalAddress={setLocalAddress}
                dispatch={dispatch}
              />
              <ChangeMapView coords={coords} />
            </MapContainer>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center gap-4 border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                  paymentMethod === "cod"
                    ? "border-[#ff4d2d] bg-orange-50 shadow-lg scale-[1.02]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className="text-3xl text-green-500">
                  <MdDeliveryDining />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">
                    Cash On Delivery
                  </p>
                  <p className="text-sm text-gray-500">
                    Pay when your food arrives
                  </p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod("online")}
                className={`flex items-center gap-4 border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                  paymentMethod === "online"
                    ? "border-[#ff4d2d] bg-orange-50 shadow-lg scale-[1.02]"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <span className="text-3xl text-blue-500">
                  <MdOutlinePayment />
                </span>
                <div>
                  <p className="font-semibold text-gray-700">Online Payment</p>
                  <p className="text-sm text-gray-500">
                    Pay securely via UPI / Card
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">
              {cartItems.length > 0 ? (
                cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-green-300 bg-green-50 rounded-lg px-4 py-2 shadow-sm"
                  >
                    <span className="text-gray-700 font-medium">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-gray-900 font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No items in cart</p>
              )}
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t">
              <span className="font-semibold text-lg text-gray-800">Total</span>
              <span className="font-bold text-lg text-[#ff4d2d]">
                ₹
                {cartItems.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )}
              </span>
            </div>
          </section>
          <button
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold"
            onClick={handlePlaceOrder}
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckOut;
