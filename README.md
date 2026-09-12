# 🌦️ Weather App

A full-stack weather application built using **HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, and Open-Meteo API**.

This project was created as a practical learning project to understand how a frontend communicates with a backend, how APIs are consumed, how data is stored in MongoDB, and how a full-stack application is deployed.

---

## 🚀 Live Demo

**Frontend:**  
https://weather-app-7b3l.vercel.app

**Backend API:**  
https://backend-mt1m.vercel.app

> Replace the frontend URL above with your actual Vercel frontend URL.

---

## 📌 Features

- 🌤️ Search weather by city name
- 🌡️ Display current temperature
- 💧 Display relative humidity
- 🌥️ Display weather code
- 📍 Display city coordinates
- ⭐ Add cities to favorites
- 📋 View all favorite cities
- ✏️ Update favorite cities
- 🗑️ Delete favorite cities
- 🚫 Prevent duplicate favorite cities
- 🔌 REST API based backend
- 💾 MongoDB Atlas database
- 🌐 Deployed using Vercel
- 🔐 Environment variables for database credentials
- 🌍 CORS enabled for frontend-backend communication

---

# 🛠️ Technologies Used

## Frontend

- HTML5
- CSS3
- JavaScript
- Fetch API

## Backend

- Node.js
- Express.js
- Axios
- CORS
- Mongoose

## Database

- MongoDB Atlas

## External API

- Open-Meteo API

## Deployment & Version Control

- Git
- GitHub
- Vercel

---

# 📂 Project Structure

```text
Weather app/
│
├── backend/
│   │
│   ├── models/
│   │   └── Favorite.js
│   │
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── frontend/
│   │
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
└── README.md
