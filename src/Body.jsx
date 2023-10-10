import Form from "./Form";
import Small from "./Small";
import "./App.css";
import axios from "axios";
export default function Body() {
  let time = document.querySelector("#time");

  let now = new Date();
  let minutes = now.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let hour = now.getHours();

  time.innerHTML = `${hour}:${minutes}`;
  let date = now.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date];
  let dayToday = document.querySelector("#today");
  dayToday.innerHTML = `${currentDay}`;
  function searchWrite(event) {
    event.preventDefault();
    let city = document.querySelector("#city");
    let search = document.querySelector("#search");
    city.innerHTML = `${search.value} `;
    let cityName = search.value;

    getWeatherByCity(cityName);
  }
  function weatherForWeek(response) {
    let forecast = response.data.list;
    let weatherElement = document.querySelector("#weather-for-week");
    let weatherHTML = `<div class="row">`;
    let uniqueDays = {};
    forecast.forEach(function (day, index) {
      let date = new Date(day.dt * 1000);
      let dayString = formatDay(date);

      if (!uniqueDays[dayString]) {
        uniqueDays[dayString] = true;
        if (index < 6) {
          weatherHTML =
            weatherHTML +
            `<div class="col-2">
      <div class="date">${dayString}</div>
      <img
        class="small-img"
        src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
        alt="clear"
      />
      <div class="small-temperature">
        <span class="temperature-min">${Math.round(day.main.temp_min)}°C</span>
        <span class="temperature-max">${Math.round(day.main.temp_max)}°C</span>
      </div>
    </div>
  `;
        }
      }
    });

    weatherHTML = weatherHTML + `</div>`;
    weatherElement.innerHTML = weatherHTML;
  }
  function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
  }
  let button = document.querySelector("#search-form");
  button.addEventListener("submit", searchWrite);
  function getWeather(coordinat) {
    console.log(coordinat);
    let apiKey = "c33e70834c6af44febe9c75fe7278e28";
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinat.lat}&lon=${coordinat.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(weatherForWeek);
  }
  function displayWeather(response) {
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");

    let temperature = response.data.main.temp;
    let imgElement = document.querySelector("#img");
    imgElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    imgElement.setAttribute("alt", response.data.weather[0].description);
    temperatureElement.innerHTML = `${Math.round(
      temperature
    )} °C / ${Math.floor((temperature * 9) / 5 + 32)} °F`;
    cityElement.innerHTML = response.data.name;
    humidityElement.innerHTML = response.data.main.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
    getWeather(response.data.coord);
  }

  function getWeatherByCity(cityName) {
    let apiKey = "c33e70834c6af44febe9c75fe7278e28";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

    axios.get(apiUrl).then(displayWeather);
  }
  function searchLocation(position) {
    let apiKey = "c33e70834c6af44febe9c75fe7278e28";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

    axios.get(apiUrl).then(displayWeather);
  }
  function getCurrentWeather(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(searchLocation);
  }
  let currentButton = document.querySelector("#current-button");
  currentButton.addEventListener("click", getCurrentWeather);
  return (
    <body>
      <div class="weather">
        <Form />

        <div class="first-step">
          <div class="main-information">
            <div>
              <h1 id="city">London</h1>
              <span id="time"></span>
              <h2 id="temperature">10°C / 50°F</h2>
            </div>
            <img
              id="img"
              src="  https://openweathermap.org/img/wn/09d@2x.png "
              alt="clear"
            />
          </div>
          <div class="important-information">
            <div class="this-day">
              Today is <span id="today"></span>
            </div>

            <ul>
              <li>
                Humidity: <span id="humidity">73</span>%
              </li>
              <li>
                Wind: <span id="wind">3.6</span> km/h
              </li>
            </ul>
          </div>
        </div>
        <div id="weather-for-week" class="weather-forecast"></div>
        <Small />
      </div>
      <script src="weather.js"></script>
    </body>
  );
}
