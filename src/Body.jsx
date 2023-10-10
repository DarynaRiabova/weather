import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "./Form";
import Small from "./Small";
import "./App.css";

export default function Body() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const hour = now.getHours();

    setCurrentTime(`${hour}:${formattedMinutes}`);

    const date = now.getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = days[date];
    setCurrentDay(currentDay);
  }, []); // Run this effect only once on mount

  const searchWrite = (event) => {
    event.preventDefault();
    const city = document.querySelector("#city");
    const search = document.querySelector("#search");
    if (city) {
      city.innerHTML = `${search.value} `;
      const cityName = search.value;
      getWeatherByCity(cityName);
    }
  };

  const weatherForWeek = (response) => {
    const forecast = response.data.list;
    const weatherElement = document.querySelector("#weather-for-week");
    let weatherHTML = `<div class="row">`;
    const uniqueDays = {};

    forecast.forEach(function (day, index) {
      const date = new Date(day.dt * 1000);
      const dayString = formatDay(date);

      if (!uniqueDays[dayString]) {
        uniqueDays[dayString] = true;
        if (index < 6) {
          weatherHTML += `<div class="col-2">
            <div class="date">${dayString}</div>
            <img
              class="small-img"
              src="http://openweathermap.org/img/wn/${
                day.weather[0].icon
              }@2x.png"
              alt="clear"
            />
            <div class="small-temperature">
              <span class="temperature-min">${Math.round(
                day.main.temp_min
              )}°C</span>
              <span class="temperature-max">${Math.round(
                day.main.temp_max
              )}°C</span>
            </div>
          </div>`;
        }
      }
    });

    weatherHTML += `</div>`;
    if (weatherElement) {
      weatherElement.innerHTML = weatherHTML;
    }
  };

  const formatDay = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDay();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
  };

  const button = document.querySelector("#search-form");
  if (button) {
    button.addEventListener("submit", searchWrite);
  }

  const getWeather = (coordinat) => {
    const apiKey = "c33e70834c6af44febe9c75fe7278e28";
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinat.lat}&lon=${coordinat.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(weatherForWeek);
  };

  const displayWeather = (response) => {
    const temperatureElement = document.querySelector("#temperature");
    const cityElement = document.querySelector("#city");
    const humidityElement = document.querySelector("#humidity");
    const windElement = document.querySelector("#wind");

    const temperature = response.data.main.temp;
    const imgElement = document.querySelector("#img");
    if (imgElement) {
      imgElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
      );
      imgElement.setAttribute("alt", response.data.weather[0].description);
    }
    if (temperatureElement && cityElement && humidityElement && windElement) {
      temperatureElement.innerHTML = `${Math.round(
        temperature
      )} °C / ${Math.floor((temperature * 9) / 5 + 32)} °F`;
      cityElement.innerHTML = response.data.name;
      humidityElement.innerHTML = response.data.main.humidity;
      windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
      getWeather(response.data.coord);
    }
  };

  const getWeatherByCity = (cityName) => {
    const apiKey = "c33e70834c6af44febe9c75fe7278e28";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(displayWeather);
  };

  const searchLocation = (position) => {
    const apiKey = "c33e70834c6af44febe9c75fe7278e28";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather);
  };

  const getCurrentWeather = (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(searchLocation);
  };

  const currentButton = document.querySelector("#current-button");
  if (currentButton) {
    currentButton.addEventListener("click", getCurrentWeather);
  }

  return (
    <div className="weather">
      <Form />
      <div className="first-step">
        <div className="main-information">
          <div>
            <h1 id="city">London</h1>
            <span id="time">{currentTime}</span>
            <h2 id="temperature">10°C / 50°F</h2>
          </div>
          <img
            id="img"
            src="https://openweathermap.org/img/wn/09d@2x.png"
            alt="clear"
          />
        </div>
        <div className="important-information">
          <div className="this-day">
            Today is <span id="today">{currentDay}</span>
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
      <div id="weather-for-week" className="weather-forecast"></div>
      <Small />
    </div>
  );
}
