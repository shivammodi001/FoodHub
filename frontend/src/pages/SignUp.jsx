import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase.js";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    role: "user",
  });
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Signup handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          mobileNumber: form.mobileNumber,
          role: form.role,
        },
        { withCredentials: true }
       
      );
      // store kr diye centralize store me user ki info
       dispatch(setUserData(result.data));
      // console.log("Signup success:", result.data);
      setError("");
      setLoading(false);
      alert("Signup successful!");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  // ✅ Google Auth
  const handleGoogleAuth = async () => {
    try {
      if (!form.mobileNumber) {
        return setError(
          "Please enter your mobile number before signing up with Google."
        );
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const email = result?.user?.email;
      const fullName = result?.user?.displayName;

      const response = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName,
          mobileNumber: form.mobileNumber,
          email,
          role: form.role,
        },
        { withCredentials: true }
      );
       dispatch(setUserData(response.data));
      // console.log("Google signup success:", response.data);
      // navigate("/");
    } catch (err) {
      console.error("Google sign-in error:", err.message);
      setError(err.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-orange-600 text-center mb-6">
          FoodHub 🍴
        </h1>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Create your account
        </h2>

        {/* 🔴 Error Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          {/* Password + Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-orange-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Mobile Number */}
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={form.mobileNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          {/* Role Dropdown */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="user">User</option>
            <option value="deliveryBoy">Delivery Partner</option>
            <option value="owner">Owner</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-orange-500 text-white p-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
          </button>

          {/* Sign up with Google */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full flex items-center cursor-pointer justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-200 transition duration-300 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign up with Google</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-orange-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
