// Script JavaScript pour l'application météo
// 13/05/2025

const API_KEY = "5658fc48b94281caaa2a27cf2b9678ac";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCards = document.getElementById("weatherCards");

// Charger les villes sauvegardées au démarrage
window.onload = () => {
    const savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    savedCities.forEach(city => fetchWeather(city));
};

// Événement bouton rechercher
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        saveCity(city);
        cityInput.value = "";
    }
});

// Fonction pour appeler l'API et créer une carte météo
function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=fr`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                createWeatherCard(data);
            } else {
                alert("Ville non trouvée !");
            }
        });
}

// Fonction pour créer dynamiquement une carte météo
function createWeatherCard(data) {
    const existingCard = document.getElementById(data.name);
    if (existingCard) return; // éviter les doublons

    const card = document.createElement("div");
    card.className = "card";
    card.id = data.name;

    card.innerHTML = `
        <h3>${data.name}</h3>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Icone météo">
        <p>${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>
        <button class="refresh-btn">Actualiser</button>
        <button class="delete-btn">Supprimer</button>
    `;

    // Bouton actualiser
    card.querySelector(".refresh-btn").addEventListener("click", () => {
        card.remove();
        fetchWeather(data.name);
    });

    // Bouton supprimer
    card.querySelector(".delete-btn").addEventListener("click", () => {
        card.remove();
        removeCity(data.name);
    });

    weatherCards.appendChild(card);
}

// Sauvegarde dans localStorage
function saveCity(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
}

// Supprimer une ville du localStorage
function removeCity(city) {
    let cities = JSON.parse(localStorage.getItem("cities")) || [];
    cities = cities.filter(c => c.toLowerCase() !== city.toLowerCase());
    localStorage.setItem("cities", JSON.stringify(cities));
}
