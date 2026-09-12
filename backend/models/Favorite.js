const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;