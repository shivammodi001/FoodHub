const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * 1️⃣ shopOrderItemSchema
 * Ye schema ek **single food item** ko represent karta hai jo user ne order kiya hai.
 * - item: reference to "Item" collection
 * - price: item ka price at the time of order
 * - quantity: kitne pieces user ne order kiye
 * Ye subdocument hai, jo shopOrder ke andar embed hoga
 */
const shopOrderItemSchema = new Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    name: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true } // createdAt aur updatedAt auto generate hoga
);

/**
 * 2️⃣ shopOrderSchema
 * Ye schema **ek particular shop ke liye user ka order** ko represent karta hai.
 * Agar user ek hi order me multiple shops se items order karta hai,
 * har shop ka order alag se store hoga.
 * - shop: reference to "Shop" collection
 * - owner: shop ka owner, reference to "User"
 * - subTotal: us shop ke items ka total price
 * - shopOrderItems: array of shopOrderItemSchema (items of this shop)
 */
const shopOrderSchema = new Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subTotal: { type: Number, required: true },
    shopOrderItems: [shopOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "out of delivery", "delivered"],
      default: "pending",
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null,
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryOtp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    deliveredAt:{
      type:Date,
      default:null,
    }
  },
  { timestamps: true }
);

/**
 * 3️⃣ orderSchema
 * Ye schema **overall order** ko represent karta hai jo user ne place kiya.
 * Agar user multiple shops se items order karta hai, to shopOrder array me sab store hoga.
 * - user: reference to "User" collection
 * - paymentMethod: cod ya online
 * - deliveryAddress: address jaha order deliver karna hai
 * - totalAmount: poore order ka total
 * - shopOrder: array of shopOrderSchema (har shop ka order)
 */
const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: { type: Number, required: true },
    shopOrders: [shopOrderSchema], // multiple shops ka order
    payment:{
      type:Boolean,
      default:false,
    },
    razorpayOrderId:{
      type:String,
      default:""
    },
    razorpayPaymentId:{
      type:String,
      default:""
    }
  },
  { timestamps: true }
);

// Model create karke export kar rahe hain
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
