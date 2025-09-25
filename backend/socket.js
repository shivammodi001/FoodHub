const User = require("./models/user.model");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    // console.log("User connected:", socket.id);
    socket.on("identity", async ({ userId }) => {
      try {
        const user = await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {
      try {
        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          isOnline: true,
          socketId: socket.id,
        });

        if (user) {
          io.emit("updateDeliveryLocation",{
            deliveryBoyId:userId,
            latitude,
            longitude
          });
        }
      } catch (error) {
        console.log(error);
        
      }
    });

    socket.on("disconnect", async () => {
      try {
        await User.findOneAndUpdate(
          { socketId: socket.id },
          {
            socketId: null,
            isOnline: false,
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = socketHandler;
