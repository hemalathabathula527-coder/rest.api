async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    const error = document.getElementById("error");
    const loading = document.getElementById("loading");
    const weatherCard = document.getElementById("weatherCard");

    if (city === "") {
        error.textContent = "Please enter a city name.";
        weatherCard.style.display = "none";
        return;
    }

    error.textContent = "";
    loading.textContent = "Loading weather data...";
    weatherCard.style.display = "none";

    try {

        // Step 1: Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather information.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display data
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m} °C`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("condition").textContent =
            getWeatherCondition(current.weather_code);

        document.getElementById("weatherIcon").textContent =
            getWeatherIcon(current.weather_code);

        weatherCard.style.display = "block";

    } catch (err) {

        error.textContent = err.message;
        weatherCard.style.display = "none";

    } finally {

        loading.textContent = "";
    }
}


// Convert weather code into readable condition
function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "Partly Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 67) {
        return "Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown Weather";
}


// Weather icons
function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code >= 1 && code <= 3) {
        return "⛅";
    }

    if (code >= 45 && code <= 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌤️";
}