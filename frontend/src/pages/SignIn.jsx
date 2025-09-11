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

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Normal Signin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      // console.log("Sign in success:", result.data);
      setError("");
      setLoading(false);
      // navigate("/"); // redirect after login
    } catch (err) {
      console.error("Sign in error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Sign in failed");
      setLoading(false);
    }
  };

  // ✅ Google Signin
  const handleGoogleAuth = async () => {
    try {
     
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const email = result?.user?.email;
      const fullName = result?.user?.displayName;

      const response = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { fullName, email },
        { withCredentials: true }
      );
       dispatch(setUserData(response.data));
      // console.log("Google sign-in success:", response.data);
      setError("");
    
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
          Sign in to your account
        </h2>

        {/* 🔴 Error UI */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-orange-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-orange-500 text-white p-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"}
          </button>

          {/* Sign in with Google */}
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
              <span>Sign in with Google</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
