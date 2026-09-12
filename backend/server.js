require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

const Favorite = require("./models/Favorite");

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    next();
});

// Home route
app.get("/", (req, res) => {
    res.send("Weather backend is running!");
});


// ========================================
// WEATHER API
// ========================================

app.get("/api/weather/:city", async (req, res) => {

    try {

        const city = req.params.city;

        // Get latitude and longitude from city name
        const locationResponse = await axios.get(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const locationData = locationResponse.data;

        // Check if city exists
        if (!locationData.results || locationData.results.length === 0) {

            return res.status(404).json({
                message: "City not found"
            });

        }

        const location = locationData.results[0];

        // Get weather using latitude and longitude
        const weatherResponse = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code`
        );

        // Send response to frontend
        res.json({

            city: location.name,

            country: location.country,

            latitude: location.latitude,

            longitude: location.longitude,

            weather: weatherResponse.data.current

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch weather"
        });

    }

});


// ========================================
// FAVORITES API - CREATE
// ========================================

app.post("/api/favorites", async (req, res) => {

    try {

        let city = req.body?.city;

        // Check if city exists
        if (!city) {

            return res.status(400).json({
                message: "City is required"
            });

        }

        // Remove extra spaces
        city = city.trim();

        // Check if city is empty
        if (city === "") {

            return res.status(400).json({
                message: "City cannot be empty"
            });

        }

        // Convert city to lowercase for duplicate checking
        const cityLower = city.toLowerCase();

        // Check if city already exists
        const existingFavorite = await Favorite.findOne({
            city: {
                $regex: `^${cityLower}$`,
                $options: "i"
            }
        });

        if (existingFavorite) {

            return res.status(409).json({
                message: `${existingFavorite.city} is already in favorites`,
                favorite: existingFavorite
            });

        }

        // Capitalize first letter
        city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

        // Create favorite
        const favorite = new Favorite({
            city: city
        });

        // Save to MongoDB
        await favorite.save();

        res.status(201).json({

            message: `${city} added to favorites`,

            favorite: favorite

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to save favorite"
        });

    }

});


// ========================================
// FAVORITES API - READ ALL
// ========================================

app.get("/api/favorites", async (req, res) => {

    try {

        // Get all favorites from MongoDB
        const favorites = await Favorite.find();

        // Send favorites to client
        res.json(favorites);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to fetch favorites"
        });

    }

});

// ========================================
// FAVORITES API - DELETE
// ========================================

app.delete("/api/favorites/:id", async (req, res) => {

    try {

        // Get ID from URL
        const id = req.params.id;

        // Delete favorite from MongoDB
        const deletedFavorite = await Favorite.findByIdAndDelete(id);

        // Check if city existed
        if (!deletedFavorite) {

            return res.status(404).json({
                message: "Favorite not found"
            });

        }

        // Send success response
        res.json({
            message: `${deletedFavorite.city} removed from favorites`,
            favorite: deletedFavorite
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to delete favorite"
        });

    }

});
// ========================================
// FAVORITES API - DELETE by user
// ========================================

app.delete("/api/favorites/:id", async (req, res) => {

    try {

        // Get ID from URL
        const id = req.params.id;

        console.log("Deleting favorite:", id);

        // Find and delete favorite
        const deletedFavorite =
            await Favorite.findByIdAndDelete(id);

        // If ID doesn't exist
        if (!deletedFavorite) {

            return res.status(404).json({
                message: "Favorite not found"
            });

        }

        // Send response
        res.json({

            message: `${deletedFavorite.city} removed from favorites`,

            favorite: deletedFavorite

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to delete favorite"
        });

    }

});
// ========================================
// FAVORITES API - UPDATE
// ========================================

app.put("/api/favorites/:id", async (req, res) => {

    try {

        // Get ID from URL
        const id = req.params.id;

        // Get new city from request body
        const city = req.body?.city;

        // Check city
        if (!city) {

            return res.status(400).json({
                message: "City is required"
            });

        }

        // Find and update favorite
        const updatedFavorite = await Favorite.findByIdAndUpdate(
        id,
        { city: city },
        { returnDocument: "after" }
);

        // Check if favorite exists
        if (!updatedFavorite) {

            return res.status(404).json({
                message: "Favorite not found"
            });

        }

        // Send updated document
        res.json({
            message: "Favorite updated successfully",
            favorite: updatedFavorite
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Unable to update favorite"
        });

    }

});
// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});