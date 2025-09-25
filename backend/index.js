const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const shopRouter = require("./routes/shop.routes");
const itemRouter = require("./routes/item.routes");
const orderRouter = require("./routes/order.routes");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const socketHandler = require("./socket");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cookieParser());

const io = new Server(server,{
  cors:{
    origin: "https://foodhub-frontend-yl92.onrender.com",
    credentials: true,
    methods:['POST','GET']
  }
});

app.set("io",io);

// this is for accepting cookies from frontend
app.use(cors({
    origin: "https://foodhub-frontend-yl92.onrender.com",
    credentials: true,
}));

// Routes of Auth API
app.use("/api/auth", authRouter);
// routes for user
app.use("/api/user", userRouter);
//shop routes
app.use("/api/shop",shopRouter);
// item router
app.use("/api/item",itemRouter);
//oreder api
app.use("/api/order",orderRouter);
//socket handler
socketHandler(io);


const port = process.env.PORT || 5000;
server.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
