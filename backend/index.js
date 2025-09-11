const cookieParser = require("cookie-parser");
const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());
// this is for accepting cookies from frontend
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Routes of Auth API
app.use("/api/auth", authRouter);
// routes for user
app.use("/api/user", userRouter);

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  await connectDB();
  console.log(`Server is running on port ${port}`);
});
