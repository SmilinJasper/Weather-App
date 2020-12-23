const getLocationElement = document.querySelector(".get-location");
const searchBarElement = document.querySelector(".search-bar");
const searchButtonElement = document.querySelector(".search-button");
const weatherAppContainerElement = document.querySelector(".weather-app-container");
const notificationElement = document.querySelector(".notification");
const temperatureValueElement = document.querySelector('.temperature-value');
const weatherIconElement = document.querySelector('.weather-icon');
const weatherDescriptionElement = document.querySelector('.weather-description');
const locationInfoElement = document.querySelector('.location-info');
const weatherFeelsLikeElement = document.querySelector(".weather-feels-like");
const humidityElement = document.querySelector(".humidity");
const precipitationElement = document.querySelector(".precipitation");
const windDirectionElement = document.querySelector(".wind-direction");
const windSpeedElement = document.querySelector(".wind-speed");
const dewPointElement = document.querySelector(".dew-point");
const visibilityElement = document.querySelector(".visibility");
const sunriseElement = document.querySelector(".sunrise");
const sunsetElement = document.querySelector(".sunset");
const chronologicalElements = document.querySelectorAll(".daily-data");

const switchUnitElement = document.querySelector(".switch-unit");

const KELVIN = 273;
const key = "7a75f753f5fbb12eda481588680cd087";

const weather = {
    temperature: {
        unit: "celcius"
    },
    daily: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: []
    }
}


searchButtonElement.onclick = () => {
    runApiByCityName();
}

searchBarElement.addEventListener("keydown", (event) => {
    let key = event.keyCode;
    if (key == 13) {
        console.log("pressed");
        runApiByCityName();
    }
});

getLocationElement.onclick = () => {
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else {
        weatherAppContainerElement.style.gridRowsTemplate = "auto 250px 95px";
        notificationElement.style.display = "block";
        notificationElement.innerHTML = `Browser doesn't support Geolocation`;
    }
}

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    runApi(lat, lon);
}

function showError(error) {
    weatherAppContainerElement.style.gridTemplateRows = "auto 250px 95px";
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `${error.message}`;
}

function displayWeather() {
    temperatureValueElement.innerHTML = `<p><span class="temperature-number">${weather.temperature.value}</span><span class="initial-unit">°C</span></p>`
    weatherIconElement.innerHTML = `<img src="icons/${weather.iconId}.png"></img>`
    weatherDescriptionElement.innerHTML = ` <p>${weather.description}</p>`;
    locationInfoElement.innerHTML = `<p>${weather.locationInfo}</p>`;
    weatherFeelsLikeElement.innerHTML = ` <p>Feels like <span>${weather.temperature.feels_like}°</span></p>`;
    humidityElement.innerHTML = `<p>Humidity <span>${weather.humidity}%</span></p>`;
    precipitationElement.innerHTML = ` <p>Precipitation <span>${weather.precipitation}%</span></p>`;
    windSpeedElement.innerHTML = `<p>Wind <span>${weather.wind_speed} kmph</span></p>`
    dewPointElement.innerHTML = `Dew point <span>${weather.dew_point}°</span>`;
    visibilityElement.innerHTML = `Visibility <span>${weather.visibility} km</span>`;
    sunriseElement.innerHTML = `Sunrise <span>${weather.sunrise}</span></div>`;
    sunsetElement.innerHTML = `<div class="sunset">Sunset <span>${weather.sunset}</span></div>`;

    for (let i = 0; i <= 7; i++) {
        chronologicalElements[i].children[0].innerHTML = `${weather.daily[i].name}`;
        chronologicalElements[i].children[1].innerHTML = `<img src="icons/${weather.daily[i].icon}.png">`;
        chronologicalElements[i].children[2].innerHTML = `${weather.daily[i].max}° | ${weather.daily[i].min}°`;
    }

    switchUnitElement.onclick = () => { switchUnit(); };

    const temperatureNumberElement = document.querySelector(".temperature-number");

    if (screen.width <= 758) {
        temperatureNumberElement.onclick = () => {
            switchUnit();
        }
    }
}

function runApi(lat, lon) {
    const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`;

    fetch(api)
        .then((response) => {
            const data = response.json();
            return data;
        })
        .then((data) => {
            console.log(data);
            weather.temperature.value = Math.floor(data.current.temp - KELVIN);
            weather.description = data.current.weather[0].description;
            weather.iconId = data.current.weather[0].icon;
            weather.temperature.feels_like = Math.floor(data.current.feels_like - KELVIN);
            weather.humidity = data.current.humidity;
            weather.precipitation = data.hourly[0].pop;

            const windDirection = data.current.wind_deg;
            windDirectionElement.style.transform = `rotateZ(${windDirection}deg)`;

            weather.wind_speed = data.current.wind_speed;
            weather.dew_point = Math.floor(data.current.dew_point - KELVIN);
            weather.visibility = data.current.visibility / 1000;

            const sunriseJsTime = new Date(data.current.sunrise * 1000);
            const sunriseHours = sunriseJsTime.getHours();
            const sunriseMins = sunriseJsTime.getMinutes();

            const sunsetJsTime = new Date(data.current.sunset * 1000);
            const sunsetHours = sunsetJsTime.getHours() - 12;
            const sunsetMins = sunsetJsTime.getMinutes();

            const sunriseTime = `${sunriseHours}:${sunriseMins}AM`;
            const sunsetTime = `${sunsetHours}:${sunsetMins}PM`;

            weather.sunrise = sunriseTime;
            weather.sunset = sunsetTime;

            const dayNames = [];

            for (let i = 0; i <= 7; i++) {
                let day;
                day = new Date(data.daily[i].dt * 1000);
                dayNames.push(getDayName(day.getDay()));

                weather.daily[i].name = dayNames[i];
                weather.daily[i].icon = data.daily[i].weather[0].icon;
                weather.daily[i].min = Math.floor(data.daily[i].temp.min - KELVIN);
                weather.daily[i].max = Math.floor(data.daily[i].temp.max - KELVIN);
            }
            getLocationInfo(lat, lon);
        });
}

function getLocationInfo(lat, lon) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

    fetch(api)
        .then((response) => {
            const data = response.json();
            return data;
        })
        .then((data) => {
            console.log(data);
            weather.locationInfo = `${data.name}, ${data.sys.country}`;
        })
        .then(() => {
            displayWeather();
        });
}

function runApiByCityName() {
    let searchText = searchBarElement.value;
    const api = `http://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=7a75f753f5fbb12eda481588680cd087`;
    fetch(api)
        .then((respone) => {
            const data = respone.json();
            return data;
        })
        .then((data) => {
            console.log(data);
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const coords = [lat, lon]
            console.log(coords);
            return coords;
        })
        .then((coords) => {
            runApi(coords[0], coords[1]);
        })
}

function getDayName(dayNo) {
    switch (dayNo) {
        case 0:
            return "SUN"
            break;
        case 1:
            return "MON"
            break;
        case 2:
            return "TUE"
            break;
        case 3:
            return "WED"
            break;
        case 4:
            return "THURS"
            break;
        case 5:
            return "FRI"
            break;
        case 6:
            return "SAT"
    }
}

function switchUnit() {
    if (weather.temperature.unit == "celcius") {
        weather.temperature.unit = "fahrenheit";
        temperatureValueElement.innerHTML = `<p><span class="temperature-number">${Math.floor(weather.temperature.value*1.8+32)}</span><span class="initial-unit">°F</span></p>`
        switchUnitElement.innerHTML = `°C`;

        weatherFeelsLikeElement.innerHTML = ` <p>Feels like <span>${Math.floor(weather.temperature.feels_like*1.8+32)}°</span></p>`;
        dewPointElement.innerHTML = `Dew point <span>${Math.floor(weather.dew_point*1.8+32)}°</span>`;

        for (let i = 0; i <= 7; i++) {
            chronologicalElements[i].children[2].innerHTML = `${Math.floor(weather.daily[i].max*1.8+32)}° | ${Math.floor(weather.daily[i].min*1.8+32)}°`;
        }
    } else {
        weather.temperature.unit = "celcius";
        temperatureValueElement.innerHTML = `<p><span class="temperature-number">${weather.temperature.value}</span><span class="initial-unit">°C</span></p>`
        switchUnitElement.innerHTML = `°F`;

        weatherFeelsLikeElement.innerHTML = ` <p>Feels like <span>${weather.temperature.feels_like}°</span></p>`;
        dewPointElement.innerHTML = `Dew point <span>${weather.dew_point}°</span>`;
        for (let i = 0; i <= 7; i++) {
            chronologicalElements[i].children[2].innerHTML = `${weather.daily[i].max}° | ${weather.daily[i].min}°`;
        }
    }
}

getLocation();