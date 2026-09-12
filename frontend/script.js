const API_URL = "http://localhost:3000";
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherDiv = document.getElementById("weather");
const favoritesDiv = document.getElementById("favorites");
const favoriteCount = document.getElementById("favoriteCount");


// ========================================
// SEARCH WEATHER
// ========================================

async function getWeather() {

    const city = cityInput.value.trim();

    if (!city) {

        weatherDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>

                <h2>Enter a city</h2>

                <p>Please enter a city name to search.</p>
            </div>
        `;

        return;
    }


    // Loading UI

    weatherDiv.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">⏳</div>

            <h2>Loading weather...</h2>

            <p>Getting the latest weather information.</p>

        </div>
    `;


    try {

        const response = await fetch(
            `${API_URL}/api/weather/${encodeURIComponent(city)}`
        );

        const data = await response.json();


        if (!response.ok) {

            throw new Error(data.message);

        }


        // Display weather

        weatherDiv.innerHTML = `

            <div class="weather-card">

                <div class="weather-top">

                    <div class="location">

                        <h2>${data.city}</h2>

                        <p>${data.country}</p>

                    </div>

                    <div class="weather-icon">
                        ${getWeatherIcon(data.weather.weather_code)}
                    </div>

                </div>


                <div class="temperature">

                    ${Math.round(data.weather.temperature_2m)}°C

                </div>


                <div class="weather-details">

                    <div class="detail">

                        <div class="detail-label">
                            HUMIDITY
                        </div>

                        <div class="detail-value">
                            ${data.weather.relative_humidity_2m}%
                        </div>

                    </div>


                    <div class="detail">

                        <div class="detail-label">
                            WEATHER CODE
                        </div>

                        <div class="detail-value">
                            ${data.weather.weather_code}
                        </div>

                    </div>


                    <div class="detail">

                        <div class="detail-label">
                            LOCATION
                        </div>

                        <div class="detail-value">
                            ${data.latitude.toFixed(2)},
                            ${data.longitude.toFixed(2)}
                        </div>

                    </div>

                </div>


                <button
                    class="favorite-btn"
                    onclick="addFavorite('${data.city}')"
                >

                    ⭐ Add to Favorites

                </button>

            </div>
        `;


    } catch (error) {

        weatherDiv.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">❌</div>

                <h2>Something went wrong</h2>

                <p>${error.message}</p>

            </div>

        `;

    }

}


// ========================================
// WEATHER ICON
// ========================================

function getWeatherIcon(code) {

    if (code === 0) return "☀️";

    if (code >= 1 && code <= 3) return "🌤️";

    if (code >= 45 && code <= 48) return "🌫️";

    if (code >= 51 && code <= 67) return "🌧️";

    if (code >= 71 && code <= 77) return "❄️";

    if (code >= 80 && code <= 82) return "🌦️";

    if (code >= 95) return "⛈️";

    return "🌤️";
}


// ========================================
// ADD FAVORITE
// ========================================

async function addFavorite(city) {

    try {

        const response = await fetch(
            `${API_URL}/api/favorites`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    city: city
                })

            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(data.message);

        }


        alert(data.message);

        loadFavorites();


    } catch (error) {

        alert(error.message);

    }

}


// ========================================
// LOAD FAVORITES
// ========================================

async function loadFavorites() {

    try {

        const response = await fetch(
            `${API_URL}/api/favorites`
        );


        const favorites = await response.json();


        favoritesDiv.innerHTML = "";


        favoriteCount.textContent =
            `${favorites.length} ${
                favorites.length === 1
                ? "city"
                : "cities"
            }`;


        if (favorites.length === 0) {

            favoritesDiv.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        ⭐
                    </div>

                    <h2>No favorite cities</h2>

                    <p>
                        Search for a city and add it to your favorites.
                    </p>

                </div>

            `;

            return;

        }


        favorites.forEach((favorite) => {

            favoritesDiv.innerHTML += `

                <div class="favorite-card">

                    <div
                        class="favorite-city"
                        onclick="getWeatherFromFavorite('${favorite.city}')"
                    >

                        <span class="favorite-star">
                            ⭐
                        </span>

                        <span>
                            ${favorite.city}
                        </span>

                    </div>


                    <button
                        class="delete-btn"
                        onclick="deleteFavorite('${favorite._id}')"
                        title="Remove favorite"
                    >

                        🗑️

                    </button>

                </div>

            `;

        });


    } catch (error) {

        console.log(
            "Error loading favorites:",
            error
        );

    }

}


// ========================================
// WEATHER FROM FAVORITE
// ========================================

function getWeatherFromFavorite(city) {

    cityInput.value = city;

    getWeather();

    window.scrollTo({
        top: 250,
        behavior: "smooth"
    });

}


// ========================================
// DELETE FAVORITE
// ========================================

async function deleteFavorite(id) {

    try {

        const response = await fetch(

            `${API_URL}/api/favorites/${id}`,

            {
                method: "DELETE"
            }

        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(data.message);

        }


        loadFavorites();


    } catch (error) {

        alert(error.message);

    }

}


// ========================================
// EVENTS
// ========================================

searchBtn.addEventListener(
    "click",
    getWeather
);


cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            getWeather();

        }

    }
);


// ========================================
// LOAD FAVORITES ON PAGE LOAD
// ========================================

loadFavorites();