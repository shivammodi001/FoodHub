const express = require("express");
const orderRouter = express.Router();
const {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getDeliveryBoysAssignment,
  acceptOrder,
  getCurrentOrder,
  getOrderById,
  verifyDeliveryOtp,
  sendDeliveryOtp,
  verifyPayment,
  getTodayDeliveries
} = require("../controllers/order.controllers");
const isAuth = require("../middleware/isAuth");

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.post("/verify-payment", isAuth, verifyPayment);
orderRouter.get("/my-order", isAuth, getMyOrders);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get("/get-assignments", isAuth, getDeliveryBoysAssignment);
orderRouter.get("/accept-order/:assignmentId", isAuth, acceptOrder);
orderRouter.get("/get-current-order", isAuth, getCurrentOrder);
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById);
orderRouter.get("/get-today-deliveries", isAuth, getTodayDeliveries);

//Otp related routes
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp", isAuth, verifyDeliveryOtp);

module.exports = orderRouter;
