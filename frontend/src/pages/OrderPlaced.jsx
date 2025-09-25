import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderPlaced() {
    const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        {/* ✅ Success Icon */}
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="w-20 h-20 text-green-500" />
        </motion.div>

        {/* 🎉 Success Message */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Order Placed Successfully 🎉
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-6"
        >
          Thank you for shopping with us. Your order is being processed and will
          be delivered soon.
        </motion.p>

        {/* 🚀 Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-orange-600 transition-all"
          onClick={() => navigate("/my-orders")}
        >
          Continue Shopping
        </motion.button>
      </motion.div>
    </div>
  );
}

export default OrderPlaced;
