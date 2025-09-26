# 🍴 FoodHub - MERN Project

FoodHub is a MERN (MongoDB, Express, React, Node.js) based food ordering and management application.  
This project is designed to handle **user authentication**, **food items**, **order management**, and **image uploads**.

---

## 🚀 Tech Stack
### Backend
- **Node.js + Express.js** – Server & API
- **MongoDB + Mongoose** – Database
- **JWT + bcryptjs** – Authentication & Security
- **dotenv** – Environment variables
- **cookie-parser** – Cookies & sessions
- **cors** – Frontend-backend connection
- **nodemon** – Development

### Frontend
- **React (Vite)** – UI framework
- **TailwindCSS** – Styling
- **React Router DOM** – Routing
- **React Icons** – Icons
- **Axios** – API calls
- **Firebase** – Google Authentication
- **Redux Toolkit + React Redux** – State management
- **Leaflet + React-Leaflet** – Map integration

---

## 📦 Installed Dependencies

### Backend
```bash
npm install express mongoose nodemon dotenv bcryptjs jsonwebtoken cookie-parser cors

# Forgot password functionality
npm install nodemailer

# Image upload & storage
npm install multer cloudinary
```

### Frontend
```bash
# Vite React setup
npm create vite@latest frontend

# Install project dependencies
npm install

# TailwindCSS setup
npm install tailwindcss @tailwindcss/vite

# Routing
npm install react-router-dom

# Icons
npm install react-icons

# API Calls
npm install axios

# Google Authentication
npm install firebase

# Redux
npm install @reduxjs/toolkit react-redux

# Maps
npm install leaflet react-leaflet
```

---

## 🔐 Forgot Password Flow (Backend)
Implemented a **3-step Forgot Password functionality**:

1. **Send Email** → User submits email to backend.  
2. **OTP Generation** → Backend sends OTP to the user’s email (via **Nodemailer**).  
3. **Password Reset** → User resets password using OTP.  

---

## 📂 Project Structure
```
FoodHub/
│-- backend/            # Node.js & Express.js server
│   │-- routes/         # API routes
│   │-- models/         # MongoDB models
│   │-- controllers/    # Controller logic
│   │-- utils/          # Helper functions
│   │-- uploads/        # Multer temp storage
│   │-- .env            # Env variables
│
│-- frontend/           # React (Vite + TailwindCSS) app
│   │-- src/
│   │   │-- components/ # Reusable components
│   │   │-- pages/      # UI Pages
│   │   │-- store/      # Redux store
│   │   │-- App.jsx     # Main App
│   │   │-- main.jsx    # Entry point
│
│-- README.md           # Documentation
```

---

## ⚙️ Installation & Setup

### Backend
```bash
cd backend
npm install
npm run dev
```
Server runs at 👉 `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at 👉 `http://localhost:5173`

---

## 🔑 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_FIRE_BASE_API_KEY="your_api_key_here"
VITE_FIRE_BASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIRE_BASE_PROJECT_ID="your_project_id"
VITE_FIRE_BASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIRE_BASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIRE_BASE_APP_ID="your_app_id"

# Map API Key
VITE_GEOAPIKEY="your_geo_api_key"

# Razorpay (Public Key)
VITE_RAZORPAY_KEY_ID="rzp_test_12345"
```

Access in React (Vite):
```js
const apiKey = import.meta.env.VITE_FIRE_BASE_API_KEY;
```

### Backend (`backend/.env`)
```env
PORT=8000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/FoodHub

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Nodemailer (for Forgot Password OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (Private Key)
RAZORPAY_KEY_ID=rzp_test_12345
RAZORPAY_KEY_SECRET=your_secret_key
```

---

## 📌 Features
- 🔑 User Authentication (Register/Login with JWT & Google Auth)  
- 📧 Forgot Password (Email OTP based reset)  
- 🍔 Manage Food Items (Add, Update, Delete, Image Upload with Multer & Cloudinary)  
- 🛒 Order Management (Place & Track Orders)  
- 🗺️ Map Integration with Leaflet  
- 🔐 Secure Password Hashing with bcryptjs  
- 🌍 CORS enabled for frontend-backend communication  

---

## 🛠️ Future Enhancements
- ✅ Payment Gateway Integration (Razorpay/Stripe)  
- ✅ Admin Dashboard for managing orders & users  
- ✅ Live Order Tracking with WebSockets  

---

## 👨‍💻 Author
**Shivam Modi**  
🚀 MERN Developer | 💻 B.Tech CSE Student
