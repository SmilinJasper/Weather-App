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

const dailyDataDay0Element = document.querySelector(".daily-data-day-0");
const dailyDataDay1Element = document.querySelector(".daily-data-day-1");
const dailyDataDay2Element = document.querySelector(".daily-data-day-2");
const dailyDataDay3Element = document.querySelector(".daily-data-day-3");
const dailyDataDay4Element = document.querySelector(".daily-data-day-4");
const dailyDataDay5Element = document.querySelector(".daily-data-day-5");
const dailyDataDay6Element = document.querySelector(".daily-data-day-6");
const dailyDataDay7Element = document.querySelector(".daily-data-day-7");

const dailyDataDay0IconElement = document.querySelector(".daily-data-icon-0");
const dailyDataDay1IconElement = document.querySelector(".daily-data-icon-1");
const dailyDataDay2IconElement = document.querySelector(".daily-data-icon-2");
const dailyDataDay3IconElement = document.querySelector(".daily-data-icon-3");
const dailyDataDay4IconElement = document.querySelector(".daily-data-icon-4");
const dailyDataDay5IconElement = document.querySelector(".daily-data-icon-5");
const dailyDataDay6IconElement = document.querySelector(".daily-data-icon-6");
const dailyDataDay7IconElement = document.querySelector(".daily-data-icon-7");

const dailyDataDay0MinMAxElement = document.querySelector('.daily-data-min-max-0');
const dailyDataDay1MinMAxElement = document.querySelector('.daily-data-min-max-1');
const dailyDataDay2MinMAxElement = document.querySelector('.daily-data-min-max-2');
const dailyDataDay3MinMAxElement = document.querySelector('.daily-data-min-max-3');
const dailyDataDay4MinMAxElement = document.querySelector('.daily-data-min-max-4');
const dailyDataDay5MinMAxElement = document.querySelector('.daily-data-min-max-5');
const dailyDataDay6MinMAxElement = document.querySelector('.daily-data-min-max-6');
const dailyDataDay7MinMAxElement = document.querySelector('.daily-data-min-max-7');

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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getPosition, showError);
    } else {
        console.log(`Browser doesn't support Geolocation`);
    }

    function getPosition(position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        runApi(lat, lon);
    }

    function showError(error) {
        console.log(error.message);
    }
}

function getWeather() {
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

    dailyDataDay0Element.innerHTML = `${weather.daily[0].name}`;
    dailyDataDay1Element.innerHTML = `${weather.daily[1].name}`;
    dailyDataDay2Element.innerHTML = `${weather.daily[2].name}`;
    dailyDataDay3Element.innerHTML = `${weather.daily[3].name}`;
    dailyDataDay4Element.innerHTML = `${weather.daily[4].name}`;
    dailyDataDay5Element.innerHTML = `${weather.daily[5].name}`;
    dailyDataDay6Element.innerHTML = `${weather.daily[6].name}`;
    dailyDataDay7Element.innerHTML = `${weather.daily[7].name}`;

    dailyDataDay0IconElement.innerHTML = `<img src="icons/${weather.daily[0].icon}.png">`;
    dailyDataDay1IconElement.innerHTML = `<img src="icons/${weather.daily[1].icon}.png">`;
    dailyDataDay2IconElement.innerHTML = `<img src="icons/${weather.daily[2].icon}.png">`;
    dailyDataDay3IconElement.innerHTML = `<img src="icons/${weather.daily[3].icon}.png">`;
    dailyDataDay4IconElement.innerHTML = `<img src="icons/${weather.daily[4].icon}.png">`;
    dailyDataDay5IconElement.innerHTML = `<img src="icons/${weather.daily[5].icon}.png">`;
    dailyDataDay6IconElement.innerHTML = `<img src="icons/${weather.daily[6].icon}.png">`;
    dailyDataDay7IconElement.innerHTML = `<img src="icons/${weather.daily[7].icon}.png">`;

    dailyDataDay0MinMAxElement.innerHTML = `${weather.daily[0].max}° | ${weather.daily[0].min}°`;
    dailyDataDay1MinMAxElement.innerHTML = `${weather.daily[1].max}° | ${weather.daily[1].min}°`;
    dailyDataDay2MinMAxElement.innerHTML = `${weather.daily[2].max}° | ${weather.daily[2].min}°`;
    dailyDataDay3MinMAxElement.innerHTML = `${weather.daily[3].max}° | ${weather.daily[3].min}°`;
    dailyDataDay4MinMAxElement.innerHTML = `${weather.daily[4].max}° | ${weather.daily[4].min}°`;
    dailyDataDay5MinMAxElement.innerHTML = `${weather.daily[5].max}° | ${weather.daily[5].min}°`;
    dailyDataDay6MinMAxElement.innerHTML = `${weather.daily[6].max}° | ${weather.daily[6].min}°`;
    dailyDataDay7MinMAxElement.innerHTML = `${weather.daily[7].max}° | ${weather.daily[7].min}°`;

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

            const day0 = new Date(data.daily[0].dt * 1000);
            const dayName0 = getDayName(day0.getDay());
            const day1 = new Date(data.daily[1].dt * 1000);
            const dayName1 = getDayName(day1.getDay());
            const day2 = new Date(data.daily[2].dt * 1000);
            const dayName2 = getDayName(day2.getDay());
            const day3 = new Date(data.daily[3].dt * 1000);
            const dayName3 = getDayName(day3.getDay());
            const day4 = new Date(data.daily[4].dt * 1000);
            const dayName4 = getDayName(day4.getDay());
            const day5 = new Date(data.daily[5].dt * 1000);
            const dayName5 = getDayName(day5.getDay());
            const day6 = new Date(data.daily[6].dt * 1000);
            const dayName6 = getDayName(day6.getDay());
            const day7 = new Date(data.daily[7].dt * 1000);
            const dayName7 = getDayName(day7.getDay());

            weather.daily[0].name = dayName0;
            weather.daily[1].name = dayName1;
            weather.daily[2].name = dayName2;
            weather.daily[3].name = dayName3;
            weather.daily[4].name = dayName4;
            weather.daily[5].name = dayName5;
            weather.daily[6].name = dayName6;
            weather.daily[7].name = dayName7;

            weather.daily[0].icon = data.daily[0].weather[0].icon;
            weather.daily[1].icon = data.daily[1].weather[0].icon;
            weather.daily[2].icon = data.daily[2].weather[0].icon;
            weather.daily[3].icon = data.daily[3].weather[0].icon;
            weather.daily[4].icon = data.daily[4].weather[0].icon;
            weather.daily[5].icon = data.daily[5].weather[0].icon;
            weather.daily[6].icon = data.daily[6].weather[0].icon;
            weather.daily[7].icon = data.daily[7].weather[0].icon;

            weather.daily[0].min = Math.floor(data.daily[0].temp.min - KELVIN);
            weather.daily[1].min = Math.floor(data.daily[1].temp.min - KELVIN);
            weather.daily[2].min = Math.floor(data.daily[2].temp.min - KELVIN);
            weather.daily[3].min = Math.floor(data.daily[3].temp.min - KELVIN);
            weather.daily[4].min = Math.floor(data.daily[4].temp.min - KELVIN);
            weather.daily[5].min = Math.floor(data.daily[5].temp.min - KELVIN);
            weather.daily[6].min = Math.floor(data.daily[6].temp.min - KELVIN);
            weather.daily[7].min = Math.floor(data.daily[7].temp.min - KELVIN);

            weather.daily[0].max = Math.floor(data.daily[0].temp.max - KELVIN);
            weather.daily[1].max = Math.floor(data.daily[1].temp.max - KELVIN);
            weather.daily[2].max = Math.floor(data.daily[2].temp.max - KELVIN);
            weather.daily[3].max = Math.floor(data.daily[3].temp.max - KELVIN);
            weather.daily[4].max = Math.floor(data.daily[4].temp.max - KELVIN);
            weather.daily[5].max = Math.floor(data.daily[5].temp.max - KELVIN);
            weather.daily[6].max = Math.floor(data.daily[6].temp.max - KELVIN);
            weather.daily[7].max = Math.floor(data.daily[7].temp.max - KELVIN);

            getLocationInfo(lat, lon);
        });
}

getLocation();

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
            getWeather();
        });
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
            break;
    }
}

function switchUnit() {
    if (weather.temperature.unit == "celcius") {
        weather.temperature.unit = "fahrenheit";
        temperatureValueElement.innerHTML = `<p><span class="temperature-number">${Math.floor(weather.temperature.value*1.8+32)}</span><span class="initial-unit">°F</span></p>`
        switchUnitElement.innerHTML = `°C`;

        weatherFeelsLikeElement.innerHTML = ` <p>Feels like <span>${Math.floor(weather.temperature.feels_like*1.8+32)}°</span></p>`;
        dewPointElement.innerHTML = `Dew point <span>${Math.floor(weather.dew_point*1.8+32)}°</span>`;

        dailyDataDay0MinMAxElement.innerHTML = `${Math.floor(weather.daily[0].max*1.8+32)}° | ${Math.floor(weather.daily[0].min*1.8+32)}°`;
        dailyDataDay1MinMAxElement.innerHTML = `${Math.floor(weather.daily[1].max*1.8+32)}° | ${Math.floor(weather.daily[1].min*1.8+32)}°`;
        dailyDataDay2MinMAxElement.innerHTML = `${Math.floor(weather.daily[2].max*1.8+32)}° | ${Math.floor(weather.daily[2].min*1.8+32)}°`;
        dailyDataDay3MinMAxElement.innerHTML = `${Math.floor(weather.daily[3].max*1.8+32)}° | ${Math.floor(weather.daily[3].min*1.8+32)}°`;
        dailyDataDay4MinMAxElement.innerHTML = `${Math.floor(weather.daily[4].max*1.8+32)}° | ${Math.floor(weather.daily[4].min*1.8+32)}°`;
        dailyDataDay5MinMAxElement.innerHTML = `${Math.floor(weather.daily[5].max*1.8+32)}° | ${Math.floor(weather.daily[5].min*1.8+32)}°`;
        dailyDataDay6MinMAxElement.innerHTML = `${Math.floor(weather.daily[6].max*1.8+32)}° | ${Math.floor(weather.daily[6].min*1.8+32)}°`;
        dailyDataDay7MinMAxElement.innerHTML = `${Math.floor(weather.daily[7].max*1.8+32)}° | ${Math.floor(weather.daily[7].min*1.8+32)}°`;
    } else {
        weather.temperature.unit = "celcius";
        temperatureValueElement.innerHTML = `<p><span class="temperature-number">${weather.temperature.value}</span><span class="initial-unit">°C</span></p>`
        switchUnitElement.innerHTML = `°F`;

        weatherFeelsLikeElement.innerHTML = ` <p>Feels like <span>${weather.temperature.feels_like}°</span></p>`;
        dewPointElement.innerHTML = `Dew point <span>${weather.dew_point}°</span>`;

        dailyDataDay0MinMAxElement.innerHTML = `${weather.daily[0].max}° | ${weather.daily[0].min}°`;
        dailyDataDay1MinMAxElement.innerHTML = `${weather.daily[1].max}° | ${weather.daily[1].min}°`;
        dailyDataDay2MinMAxElement.innerHTML = `${weather.daily[2].max}° | ${weather.daily[2].min}°`;
        dailyDataDay3MinMAxElement.innerHTML = `${weather.daily[3].max}° | ${weather.daily[3].min}°`;
        dailyDataDay4MinMAxElement.innerHTML = `${weather.daily[4].max}° | ${weather.daily[4].min}°`;
        dailyDataDay5MinMAxElement.innerHTML = `${weather.daily[5].max}° | ${weather.daily[5].min}°`;
        dailyDataDay6MinMAxElement.innerHTML = `${weather.daily[6].max}° | ${weather.daily[6].min}°`;
        dailyDataDay7MinMAxElement.innerHTML = `${weather.daily[7].max}° | ${weather.daily[7].min}°`;
    }
}