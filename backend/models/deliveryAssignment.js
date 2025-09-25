const mongoose = require("mongoose");
const { Schema } = mongoose;

const deliveryAssignmentSchema = new Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    shopOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    brodcastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["brodcasted", "assigned", "completed"],
      default: "brodcasted",
    },
    acceptedAt: Date,
  },
  { timestamps: true }
);


const DeliveryAssignment = mongoose.model(
  "DeliveryAssignment",
  deliveryAssignmentSchema
);

module.exports = DeliveryAssignment;
