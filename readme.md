# 🍴 FoodHub - MERN Project

FoodHub is a MERN (MongoDB, Express, React, Node.js) based food ordering and management application.  
This project is designed to handle user authentication, food items, and order management.

---

## 🚀 Tech Stack
- **Frontend**: React (to be added later)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Token) & bcryptjs
- **Environment Config**: dotenv
- **Cookies & Sessions**: cookie-parser
- **CORS**: To connect frontend & backend
- **Development**: nodemon

---

## 📦 Installed Dependencies
```bash
npm install express mongoose nodemon dotenv bcryptjs jsonwebtoken cookie-parser cors


# for forgot password email functionality
npm install nodemailer 

I just created 3 step for forgot password functionality
`` In backend i have created 3 routes for forgot password functionality
-- 
step 1: User will send email to backend for otp
step 2: Backend will send a otp to user email
step 3: User will reset password using the otp

```

#for storing images
 npm i multer cloudinary

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# 🎨 FoodHub Frontend (React + Vite + TailwindCSS)

This is the **frontend** of the FoodHub MERN project, built with **React (Vite)** and styled using **TailwindCSS**.  
It connects with the FoodHub backend through REST APIs.

---

## 🚀 Tech Stack
- **React (Vite)** – Fast frontend framework
- **TailwindCSS** – Utility-first CSS framework
- **JavaScript (ES6+)** – Logic & state management

---

## 📦 Installed Dependencies
```bash
# Vite React setup
npm create vite@latest frontend

# Install project dependencies
npm install

# TailwindCSS setup
npm install tailwindcss @tailwindcss/vite


# for Routing 
npm install react-router-dom

#for Icons 
npm install react-icons

# Axios for API calls
npm install axios

# Google Authentication 
npm install firebase

# Redux for centralize store
npm install @reduxjs/toolkit
npm install react-redux
#this for showing map
npm i leaflet
 npm i react-leaflet