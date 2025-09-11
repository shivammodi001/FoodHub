import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // 🔴 Error state
  const navigate = useNavigate();

  const handleBack = () => {
    if (step === 1) {
      navigate("/signin");
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  // API call to send OTP
  const handleSendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      console.log("OTP sent:", result.data);
      setError(""); // ✅ clear error
      setStep(2);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  // API call to verify OTP
  const handleVerifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log("OTP verified:", result.data);
      setError(""); // ✅ clear error
      setStep(3);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.response?.data?.message || "Failed to verify OTP. Please try again.");
    }
  };

  // API call to reset password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      console.log("Password reset successful:", result.data);
      setError(""); // ✅ clear error
      alert("Password reset successful. Please sign in with your new password.");
      navigate("/signin");
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-orange-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <IoIosArrowRoundBack
            className="text-2xl text-gray-600 hover:text-orange-500 cursor-pointer"
            onClick={handleBack}
          />
          <h1 className="text-3xl font-bold text-orange-600 text-center flex-1">
            Forgot Password
          </h1>
        </div>

        {/* 🔴 Error UI */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Step content */}
        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <button
              className="mt-4 w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-3 text-gray-600 text-sm">
              Enter the OTP sent to <span className="font-medium">{email}</span>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="border border-gray-300 p-2 rounded w-full"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
            <button
              className="mt-4 w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              className="border border-gray-300 p-2 rounded w-full"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="border border-gray-300 p-2 mt-2 rounded w-full"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <button
              className="mt-4 w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
