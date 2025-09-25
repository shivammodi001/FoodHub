const Order = require("../models/order.model");
const Shop = require("../models/shop.model");
const User = require("../models/user.model");
const DeliveryAssignment = require("../models/deliveryAssignment");
const { sendDeliveryOtpMail } = require("../utils/mail");
const Razorpay = require("razorpay");
require("dotenv").config();

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    if (!cartItems || cartItems.length == 0) {
      return res.status(400).json({ message: "cart is empty" });
    }

    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ message: "send complete delivery address" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      // basically jiska jo order h usi ke paas uska order jaye isliye yeh kr rahe hain
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    // creating shop order
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({ message: "shop not found" });
        }

        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal: subtotal,
          shopOrderItems: items.map((i) => ({
            item: i.id || i._id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      })
    );

    if (paymentMethod == "online") {
      // console.log(totalAmount);

      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      console.log(razorOrder);

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod,
        deliveryAddress,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      return res.status(201).json({
        razorOrder,
        orderId: newOrder._id,
      });
    }

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "name");
    await newOrder.populate("shopOrders.owner", "name socketId");
    await newOrder.populate("user", "name email mobileNumber");

    const io = req.app.get("io");

    if (io) {
      newOrder.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: newOrder._id,
            paymentMethod: newOrder.paymentMethod,
            user: newOrder.user,
            shopOrders: shopOrder,
            createdAt: newOrder.createdAt,
            deliveryAddress: newOrder.deliveryAddress,
            payment: newOrder.payment,
          });
        }
      });
    }

    return res.status(201).json(newOrder);
  } catch (err) {
    return res.status(500).json({ message: `place order error ${err}` });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id);
    if (!payment || payment.status != "captured") {
      return res.status(400).json({ message: "payment not captured" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("shopOrders.shop", "name");
    await order.populate("shopOrders.owner", "name socketId");
    await order.populate("user", "name email mobileNumber");

    const io = req.app.get("io");

    if (io) {
      order.shopOrders.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          io.to(ownerSocketId).emit("newOrder", {
            _id: order._id,
            paymentMethod: order.paymentMethod,
            user: order.user,
            shopOrders: shopOrder,
            createdAt: order.createdAt,
            deliveryAddress: order.deliveryAddress,
            payment: order.payment,
          });
        }
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `verify payment order error ${err}` });
  }
};

// Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobileNumber");

      // Filter only shopOrders that belong to this owner
      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        payment: order.payment,
      }));

      return res.status(200).json(filteredOrders);
    }
  } catch (err) {
    console.error("Get User Orders Error:", err);
    return res.status(500).json({ message: `get user orders error ${err}` });
  }
};

// status change
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => String(o.shop) === String(shopId)
    );

    if (!shopOrder) {
      return res.status(404).json({ message: "shopOrder not found" });
    }

    shopOrder.status = status;

    let deliveryBoysPayload = [];
    if (status == "out of delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
              $maxDistance: 5000, // 5km ke ander jitne delivery boy hain
            },
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);
      // filter busy wale delivery boys
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id))
      );

      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length == 0) {
        await order.save();
        return res.status(400).json({
          message:
            "order status updated but there is no available delivery boys",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        brodcastedTo: candidates,
        status: "brodcasted",
      });

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;

      shopOrder.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates[0],
        latitude: b.location.coordinates[1],
        mobile: b.mobileNumber,
      }));

      await deliveryAssignment.populate("order");
      await deliveryAssignment.populate("shop");

      const io = req.app.get("io");
      if (io) {
        availableBoys.forEach((boy) => {
          const boySocketId = boy.socketId;
          if (boySocketId) {
            io.to(boySocketId).emit("newAssigment", {
              sentTo: boy._id,
              assignmentId: deliveryAssignment._id,
              orderId: deliveryAssignment.order?._id || null,
              shopName: deliveryAssignment.shop?.name || "Unknown Shop",
              deliveryAddress:
                deliveryAssignment.order?.deliveryAddress || "No Address",
              items:
                deliveryAssignment.order.shopOrders.find((so) =>
                  so._id.equals(deliveryAssignment.shopOrderId)
                ).shopOrderItems || [],
              subtotal: deliveryAssignment.order.shopOrders.find((so) =>
                so._id.equals(deliveryAssignment.shopOrderId)
              )?.subTotal,
            });
          }
        });
      }
    }

    // ✅ parent document save karna hoga
    // await shopOrder.save();
    await order.save();

    const updatedShopOrder = order.shopOrders.find(
      (o) => String(o.shop) === String(shopId)
    );
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobileNumber"
    );
    await order.populate("user", "socketId");

    const io = req.app.get("io");
    if (io) {
      const userSocketId = order.user.socketId;
      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment._id,
    });
  } catch (err) {
    return res.status(500).json({ message: `Order status error ${err}` });
  }
};

const getDeliveryBoysAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignment = await DeliveryAssignment.find({
      brodcastedTo: deliveryBoyId,
      status: "brodcasted",
    })
      .populate("order")
      .populate("shop");

    const formatted = assignment.map((a) => {
      const shopOrder = a.order?.shopOrders?.find(
        (so) => String(so._id) === String(a.shopOrderId)
      );

      return {
        assignmentId: a._id,
        orderId: a.order?._id || null,
        shopName: a.shop?.name || "Unknown Shop",
        deliveryAddress: a.order?.deliveryAddress || "No Address",
        items: shopOrder?.shopOrderItems || [],
        subtotal: shopOrder?.subTotal ?? 0,
      };
    });

    return res.status(200).json(formatted);
  } catch (err) {
    return res.status(500).json({ message: `Get Assignement Error ${err}` });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(400).json({ message: `Assignement not found` });
    }

    // agar order assigned ho gaya yah complete ho gaya toh dusra koi accept nhi kr skta
    if (assignment.status != "brodcasted") {
      return res.status(400).json({ message: `Assignement is expired` });
    }

    // agar delivery boy already assign h kisi orr order ke liye toh accept nhi kr skta
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "You are already assigned to another order.." });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";

    assignment.acceptedAt = new Date();
    await assignment.save();

    // abbb order me bhi store kr denege kis delivery boy ne accepy kiya order ko
    const order = await Order.findById(assignment.order);
    if (!order) {
      return res.status(400).json({ message: `Order not found` });
    }

    const shopOrder = order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString()
    );
    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save();

    // await order.populate('shopOrders.assignedDeliveryBoy')

    return res.status(201).json({
      message: "Order Accepted",
    });
  } catch (err) {
    return res.status(500).json({ message: `Accept Order Error ${err}` });
  }
};

const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullname email mobileNumber location")
      .populate({
        path: "order",
        populate: [
          {
            path: "user",
            select: "fullName email location mobileNumber",
          },
        ],
      });

    if (!assignment) {
      return res.status(400).json({ message: "assignment not found" });
    }

    const shopOrder = assignment.order.shopOrders.find(
      (so) => String(so._id) === String(assignment.shopOrderId)
    );

    if (!shopOrder) {
      return res.status(400).json({ message: "shopOrder not found" });
    }

    let deliveryBoyLocation = { lat: null, lon: null };
    if (assignment.assignedTo.location?.coordinates?.length === 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.latitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (err) {
    return res.status(500).json({ message: `Get Current Order Error: ${err}` });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(400).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (err) {
    return res.status(500).json({ message: `Get  Order By Id Error: ${err}` });
  }
};

const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;

    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({ message: "Order or ShopOrder not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // otp valid till 5mins

    await order.save();

    await sendDeliveryOtpMail(order.user, otp);

    return res
      .status(200)
      .json({ message: `Otp sent successfully to ${order.user?.fullName}` });
  } catch (error) {
    return res.status(500).json({ message: `Delivery Otp Error ${error}` });
  }
};

const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId, otp } = req.body;

    const order = await Order.findById(orderId).populate("user");
    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({ message: "Order or ShopOrder not found" });
    }

    if (
      otp !== shopOrder.deliveryOtp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid/Expire OTP." });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();

    await order.save();

    // delivery complete hone ke baad delete assignment
    await DeliveryAssignment.deleteOne({
      shopOrderId: shopOrder._id,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });

    return res.status(200).json({ message: "Ordered Delivered Successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Verify Delivery Otp Error ${error}` });
  }
};

const getTodayDeliveries = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const startsOfDay = new Date();
    startsOfDay.setHours(0, 0, 0, 0); //starting from 12:00 A.M.

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy": deliveryBoyId,
      "shopOrders.status": "delivered",
      "shopOrders.deliveredAt": { $gte: startsOfDay },
    });

    let todaysDeliveries = []; //isme sare shop woh jo aaj (current day) ke din delivered huye h
    orders.forEach((order) => {
      order.shopOrders.forEach((shopOrder) => {
        if (
          shopOrder.assignedDeliveryBoy == deliveryBoyId &&
          shopOrder.status == "delivered" &&
          shopOrder.deliveredAt >= startsOfDay
        ) {
          todaysDeliveries.push(shopOrder);
        }
      });
    });

    let stats = {};
    // know here we trying to find in an Hour how manys deliveries done by Delivery-Boy
    // {
    //        hour: count,
    //        10 : 2
    // }
    todaysDeliveries.forEach((shopOrder) => {
      const hour = new Date(shopOrder.deliveredAt).getHours();
      stats[hour] = (stats[hour] || 0) + 1;
    });

    let formattedStats = Object.keys(stats).map(hour=>({
      hour:parseInt(hour),
      count:stats[hour],
    }));
    // [
    //   {
    //     hour:10,
    //     count:2
    //   },{
    //     hour:11,
    //     count5
    //   }
    // ]

    // sort in accending order
    formattedStats.sort((a,b)=>a.hour-b.hour)

    return res.status(200).json(formattedStats);

  } catch (error) {
     return res.status(500).json({message:`Get Total Deliveries Error ${error}`});

  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  updateOrderStatus,
  getDeliveryBoysAssignment,
  acceptOrder,
  getOrderById,
  getCurrentOrder,
  sendDeliveryOtp,
  verifyDeliveryOtp,
  verifyPayment,
  getTodayDeliveries,
};

// groupItemsByShop = {
// shopId1: [burger,sandwich]
// shopId2: [pizza,chole bhature]
// }
