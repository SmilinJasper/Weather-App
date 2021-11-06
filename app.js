// GET ALL REQUIRED ELEMENTS FROM HTML

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

// APP CONSTANTS 

const KELVIN = 273;
const key = "2f5cb98dbd931c10023726a1875dabf7";

// WEATHER INFO OBJECT

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

// EVENT LISTENERS TO GET WEATHER INFO

searchButtonElement.addEventListener("click", () => {
    getWeatherInfoByCityName(searchBarElement.value);
});

searchBarElement.addEventListener("keydown", (event) => {
    let key = event.keyCode;
    if (key == 13) {
        getWeatherInfoByCityName(searchBarElement.value);
    }
});

getLocationElement.addEventListener("click", () => {
    getLocation();
});

// FUNCTION TO GET GEOLOCATION

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else {
        weatherAppContainerElement.style.gridTemplateRows = "auto 250px 95px";
        notificationElement.innerHTML = `Browser doesn't support Geolocation`;
        notificationElement.style.display = "block";
    }
}

function getPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    getWeatherInfo(lat, lon);
}

// DISPLAY THE NOTIFICATION ELEMENT AND SHOW THE ERROR

function showError(error) {
    weatherAppContainerElement.style.gridTemplateRows = "auto 250px 95px";
    notificationElement.innerHTML = `${error.message}`;
    notificationElement.style.display = "block";
}

// FUNCTION TO CHANGE HTML ELEMENT VALUES AND DISPLAY WEATHER INFO

function displayWeather() {
    temperatureValueElement.innerHTML = `<p><span class="temperature-number">${weather.temperature.value}</span><span class="initial-unit">°C</span></p>`
    weatherIconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="${weather.description}"></img>`
    weatherDescriptionElement.innerHTML = ` <p>${weather.description}</p>`;
    locationInfoElement.innerHTML = `<p>${weather.locationInfo}</p>`;
    weatherFeelsLikeElement.innerHTML = ` <p>Feels like <span>${weather.temperature.feels_like}°</span></p>`;
    humidityElement.innerHTML = `<p>Humidity <span>${weather.humidity}%</span></p>`;
    precipitationElement.innerHTML = ` <p>Precipitation <span>${Math.round(weather.precipitation*100)}%</span></p>`;
    windSpeedElement.innerHTML = `<p>Wind <span>${weather.wind_speed} kmph</span></p>`
    dewPointElement.innerHTML = `Dew point <span>${weather.dew_point}°</span>`;
    visibilityElement.innerHTML = `Visibility <span>${weather.visibility} km</span>`;
    sunriseElement.innerHTML = `Sunrise <span>${weather.sunrise}</span></div>`;
    sunsetElement.innerHTML = `<div class="sunset">Sunset <span>${weather.sunset}</span></div>`;

    for (let i = 0; i <= 7; i++) {
        chronologicalElements[i].children[0].innerHTML = `${weather.daily[i].name}`;
        chronologicalElements[i].children[1].innerHTML = `<img src="icons/${weather.daily[i].icon}.png" alt="${weather.daily[i].description}">`;
        chronologicalElements[i].children[2].innerHTML = `${weather.daily[i].max}° | ${weather.daily[i].min}°`;
    }

    // TO NOT SHOW THE ERROR IF WEATHER IS DISPLAYED SUCCESSFULLY

    weatherAppContainerElement.style.gridTemplateRows = "250px 95px";
    notificationElement.style.display = "none";
}

// GET WEATHER INFO FROM API

function getWeatherInfo(lat, lon) {
    const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${key}`;

    fetch(api)
        .then((response) => {
            const data = response.json();
            return data;
        })
        .then((data) => {
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
                weather.daily[i].description = data.daily[i].weather[0].description;
            }
            getLocationInfo(lat, lon);
        });
}

// GET LOCATION INFO FROM API

function getLocationInfo(lat, lon) {
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

    fetch(api)
        .then((response) => {
            const data = response.json();
            return data;
        })
        .then((data) => {
            weather.locationInfo = `${data.name}, ${data.sys.country}`;
        })
        .then(() => {
            displayWeather();
        });
}

// HELPER FUNCTIONS TO BE USED

function displayOption(Object) {
    if (Object.hasOwnProperty("city") == true && Object.hasOwnProperty("state") == false) {
        return `<p>${Object.city}, ${Object.country}</p>`;
    } else if (Object.hasOwnProperty("city")) {
        return `<p>${Object.city}, ${Object.country}</p>`;
    } else if (Object.hasOwnProperty("state")) {
        return `<p>${Object.state}, ${Object.country}</p>`;
    } else {
        return `<p>${Object.country}</p>`;
    }
}

function removeNodes(nodeArray, numberOfNodesToRemove) {
    if (nodeArray.length > 0) {
        for (let i = 0; i < numberOfNodesToRemove; i++) { nodeArray[i].remove(); }
    }
}

function createSelectableOptions(placeOptionsList) {
    searchBarElement.style.borderBottomLeftRadius = "0px";
    searchBarElement.style.borderBottomRightRadius = "0px";

    for (let i = 0; i < placeOptionsList.length; i++) {
        placeOptionsList[i].addEventListener("click", () => {
            searchBarElement.value = placeOptionsList[i].innerText;
            getWeatherInfoByCityName(searchBarElement.value);
            removeNodes(placeOptionsList, placeOptionsList.length);
        });
    }
}

// SHOW LOCATION SUGGESTIONS WHEN SEARCHING USING API

function searchForPlace() {
    let searchText = searchBarElement.value;

    if (searchText == "") {
        return;
    }

    const searchBarContainerElement = document.querySelector(".search-bar-container");

    const apiKey = "ECzcVm1vzmQ07xEB_0IwcVe-AlUPYOl9QxIz1NVSTG8";
    const api = `https://autocomplete.geocoder.ls.hereapi.com/6.2/suggest.json?apiKey=${apiKey}&query=${searchText}&maxresults=4`;

    fetch(api)
        .then(response => response.json())
        .then((data) => {
            let suggestionElements = document.querySelectorAll(".suggestion");

            removeNodes(suggestionElements, suggestionElements.length);

            for (let i = 0; i < data.suggestions.length; i++) {
                const suggestion = document.createElement("div");
                suggestion.className = "suggestion";
                searchBarContainerElement.append(suggestion);
            }

            suggestionElements = document.querySelectorAll(".suggestion");

            createSelectableOptions(suggestionElements);

            for (let i = 0; i < suggestionElements.length; i++) {
                suggestionElements[i].innerHTML = displayOption(data.suggestions[i].address);
            }
        });
}

// EVENT LISTNERS FOR SHOWING LOCATION SUGGESTIONS WHEN SEARCHING

searchBarElement.addEventListener("input", searchForPlace);
searchBarElement.addEventListener("focus", searchForPlace);

// REMOVE LOCATION SUGGESTIONS WHEN FOCUS IS LOST FROM SEARCH BAR

function removeLocationSuggestions() {
    let suggestionElements = document.querySelectorAll(".suggestion");

    if (suggestionElements) {
        removeNodes(suggestionElements, suggestionElements.length);
        if (window.innerWidth > 758) searchBarElement.style.borderRadius = "8px";
    }
}

searchBarElement.addEventListener("blur", removeLocationSuggestions);

// GET WEATHER INFO FROM THE API BY CITY NAME SEARCHED FOR

function getWeatherInfoByCityName(searchText) {
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${key}`;

    fetch(api)
        .then((respone) => {
            const data = respone.json();
            return data;
        })
        .then((data) => {
            if (data.hasOwnProperty("message")) {
                weatherAppContainerElement.style.gridTemplateRows = "auto 250px 95px";
                notificationElement.innerHTML = `${data.message}`;
                notificationElement.style.display = "block";
                return;
            }
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const coords = [lat, lon]
            return coords;
        })
        .then((coords) => {
            if (coords) getWeatherInfo(coords[0], coords[1]);
        });
}

// FUNCTION TO FIND DAY NAME USING DAY NUMBER

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

//FUNCTION TO CONVERT THE TEMPERATURE UNIT

function switchUnit() {
    if (weather.temperature.value == undefined) {
        return;
    }

    if (weather.temperature.unit == "celcius") {
        weather.temperature.unit = "fahrenheit";
        temperatureValueElement.innerHTML = `<p><span class="temperature-number">${Math.floor(weather.temperature.value*1.8+32)}</span><span class="initial-unit">°F</span></p>`
        switchUnitElement.innerHTML = `°C`;

        weatherFeelsLikeElement.innerHTML = `<p>Feels like <span>${Math.floor(weather.temperature.feels_like*1.8+32)}°</span></p>`;
        dewPointElement.innerHTML = `Dew point <span>${Math.floor(weather.dew_point*1.8+32)}°</span>`;

        for (let i = 0; i < chronologicalElements.length; i++) {
            chronologicalElements[i].children[2].innerHTML = `${Math.floor(weather.daily[i].max*1.8+32)}° | ${Math.floor(weather.daily[i].min*1.8+32)}°`;
        }
    } else {
        weather.temperature.unit = "celcius";
        temperatureValueElement.innerHTML = `<p><span class="temperature-number">${weather.temperature.value}</span><span class="initial-unit">°C</span></p>`
        switchUnitElement.innerHTML = `°F`;

        weatherFeelsLikeElement.innerHTML = ` <p>Feels like <span>${weather.temperature.feels_like}°</span></p>`;
        dewPointElement.innerHTML = `Dew point <span>${weather.dew_point}°</span>`;

        for (let i = 0; i < chronologicalElements.length; i++) {
            chronologicalElements[i].children[2].innerHTML = `${weather.daily[i].max}° | ${weather.daily[i].min}°`;
        }
    }
}

// EVENT LISTENERS FOR SWITCHING TEMPERATURE UNIT

switchUnitElement.addEventListener("click", () => { switchUnit(); });

const temperatureNumberElement = document.querySelector(".temperature-number");

if (screen.width <= 758) {
    temperatureNumberElement.addEventListener("click", () => {
        switchUnit();
    });
}

// RUN GEOLOCATION FINDER WHEN APPLICATION IS RUN

getLocation();