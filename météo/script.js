/* =========================
   ELEMENTS
========================= */

const input = document.getElementById("city");
const suggestions = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const rain = document.getElementById("rain");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const hourlyContainer = document.querySelector(".hourly-container");
const forecastContainer = document.querySelector(".forecast-container");
const favoriteCities = document.getElementById("favoriteCities");
const favoriteBtn = document.getElementById("favoriteBtn");

/* =========================
   API
========================= */

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

/* =========================
   INIT
========================= */

searchBtn.addEventListener("click", () => {
    if (input.value.trim() !== "") {
        searchCity(input.value);
    }
});

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchCity(input.value);
    }
});

/* =========================
   AUTOCOMPLETION
========================= */

input.addEventListener("input", async () => {

    const value = input.value.trim();

    if (value.length < 2) {
        suggestions.innerHTML = "";
        return;
    }

    const res = await fetch(`${GEO_API}?name=${value}&count=5&language=fr&format=json`);
    const data = await res.json();

    suggestions.innerHTML = "";

    if (data.results) {
        data.results.forEach(city => {

            const div = document.createElement("div");
            div.classList.add("suggestion");

            div.textContent = `📍 ${city.name}, ${city.country}`;

            div.addEventListener("click", () => {
                input.value = city.name;
                suggestions.innerHTML = "";
                getWeather(city.latitude, city.longitude, city.name);
            });

            suggestions.appendChild(div);

        });
    }
});

/* =========================
   RECHERCHE VILLE
========================= */

async function searchCity(city) {

    const res = await fetch(`${GEO_API}?name=${city}&count=1&language=fr&format=json`);
    const data = await res.json();

    if (!data.results) {
        alert("Ville introuvable");
        return;
    }

    const c = data.results[0];

    getWeather(c.latitude, c.longitude, c.name);

}

/* =========================
   METEO
========================= */

async function getWeather(lat, lon, name) {

    const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&hourly=temperature_2m,weather_code&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

    const res = await fetch(url);
    const data = await res.json();

    const current = data.current;

    cityName.textContent = name;

    temp.textContent = Math.round(current.temperature_2m) + "°";
    feelsLike.textContent = Math.round(current.apparent_temperature) + "°";
    humidity.textContent = current.relative_humidity_2m + "%";
    wind.textContent = current.wind_speed_10m + " km/h";
    rain.textContent = "—";

    updateWeatherIcon(current.weather_code);

    renderHourly(data.hourly);
    renderForecast(data.daily);

}

/* =========================
   ICONES METEO
========================= */

function updateWeatherIcon(code) {

    let icon = "☀️";
    let text = "Ensoleillé";

    if (code === 0) {
        icon = "☀️"; text = "Ciel dégagé";
    } else if ([1,2,3].includes(code)) {
        icon = "🌤️"; text = "Peu nuageux";
    } else if ([45,48].includes(code)) {
        icon = "🌫️"; text = "Brume";
    } else if ([51,53,55,61,63,65].includes(code)) {
        icon = "🌧️"; text = "Pluie";
    } else if ([71,73,75].includes(code)) {
        icon = "❄️"; text = "Neige";
    } else if ([95].includes(code)) {
        icon = "⛈️"; text = "Orage";
    }

    document.querySelector(".icon").textContent = icon;
    description.textContent = text;
}

/* =========================
   PREVISIONS HEURE PAR HEURE
========================= */

function renderHourly(hourly) {

    hourlyContainer.innerHTML = "";

    for (let i = 0; i < 12; i++) {

        const div = document.createElement("div");
        div.classList.add("hour-card");

        const time = new Date(hourly.time[i]).getHours();

        div.innerHTML = `
            <p>${time}h</p>
            <div>🌡️ ${Math.round(hourly.temperature_2m[i])}°</div>
        `;

        hourlyContainer.appendChild(div);
    }
}

/* =========================
   PREVISIONS 7 JOURS
========================= */

function renderForecast(daily) {

    forecastContainer.innerHTML = "";

    for (let i = 0; i < 7; i++) {

        const date = new Date(daily.time[i]);
        const day = date.toLocaleDateString("fr-FR", { weekday: "long" });

        const div = document.createElement("div");
        div.classList.add("day");

        div.innerHTML = `
            <span>${day}</span>
            <span>🌡️ ${Math.round(daily.temperature_2m_max[i])}° / ${Math.round(daily.temperature_2m_min[i])}°</span>
        `;

        forecastContainer.appendChild(div);
    }
}

/* =========================
   GEOLOCALISATION
========================= */

navigator.geolocation.getCurrentPosition((pos) => {

    const { latitude, longitude } = pos.coords;

    getWeather(latitude, longitude, "Votre position");

});

/* =========================
   FAVORIS (LOCALSTORAGE)
========================= */

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

favoriteBtn.addEventListener("click", () => {

    const city = cityName.textContent;

    if (!favorites.includes(city)) {
        favorites.push(city);
    } else {
        favorites = favorites.filter(f => f !== city);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();

});

function renderFavorites() {

    favoriteCities.innerHTML = "";

    favorites.forEach(city => {

        const div = document.createElement("div");
        div.classList.add("favorite");
        div.textContent = city;

        div.addEventListener("click", () => {
            searchCity(city);
        });

        favoriteCities.appendChild(div);

    });
}

renderFavorites();