const apiKey = "d7ee46ea9d90a20b7d778600ae11f73f";
const apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

// Function to fetch current weather by city name
async function checkWeather(city) {
    const response = await fetch(apiUrlCurrent + city + `&appid=${apiKey}`);
    updateWeather(response);
}

// Function to fetch 5-day forecast by city name
async function getForecast(city) {
    const response = await fetch(apiUrlForecast + city + `&appid=${apiKey}`);
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".forecast").style.display = "none";
    } else {
        const data = await response.json();
        displayForecast(data.list);
    }
}

// Function to fetch current weather by coordinates
async function checkWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    updateWeather(response);
}

// Function to fetch 5-day forecast by coordinates
async function getForecastByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".forecast").style.display = "none";
    } else {
        const data = await response.json();
        displayForecast(data.list);
    }
}

// Function to update the UI with current weather data
async function updateWeather(response) {
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        if (data.weather[0].main === "Clouds") {
            weatherIcon.src = "images/clouds.png";
        } else if (data.weather[0].main === "Clear") {
            weatherIcon.src = "images/clear.png";
        } else if (data.weather[0].main === "mist"){
            weatherIcon.src = "images/mist.png";
        } else if (data.weather[0].main === "Rain"){
            weatherIcon.src = "images/rain.png"
        } else if (data.weather[0].main === "Drizzle"){
            weatherIcon.src = "images/drizzle.png";
        } else if (data.weather[0].main === "Snow"){
            weatherIcon.src = "images/snow.png";
        }

        document.querySelector(".weather").classList.add("show-weather");
        document.querySelector(".error").style.display = "none";
    }
}

// Function to display forecast data
function displayForecast(forecastList) {
    const forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = ""; // Clear previous data

    forecastList.forEach((forecast, index) => {
        if (index % 8 === 0) { // Filter to get one forecast per day
            const forecastItem = document.createElement("div");
            forecastItem.classList.add("forecast-item");

            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString("en-US", { weekday: "short" });
            const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
            const temp = Math.round(forecast.main.temp);
            const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            forecastItem.innerHTML = `
                <p>${day} ${time}</p>
                <img src="${iconUrl}" alt="${forecast.weather[0].description}">
                <p>${temp}°C</p>
                <p>${forecast.weather[0].description}</p>
            `;

            forecastContainer.appendChild(forecastItem);
        }
    });

    document.querySelector(".forecast").style.display = "flex";
}

// Event listener for search button click
searchBtn.addEventListener("click", () => {
    const city = searchBox.value;
    checkWeather(city);          // Fetch current weather by city
    getForecast(city);           // Fetch 5-day forecast by city
});

// Function to get user location and automatically fetch weather
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            checkWeatherByCoords(lat, lon);    // Fetch current weather by coordinates
            getForecastByCoords(lat, lon);     // Fetch 5-day forecast by coordinates
        }, (error) => {
            alert("Geolocation permission denied or not supported by this browser.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
}
}

// Trigger geolocation on page load
window.onload = getLocation;
