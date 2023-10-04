import axios from "axios";
import { useState } from "react";

function Weather() {
  const [description, setDescription] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windSpeed, setWindSpeed] = useState(null);
  const [icon, setIcon] = useState(null);

  function showTemperature(response) {
    setTemperature(response.data.main.temp);
    setHumidity(response.data.main.humidity);
    setWindSpeed(Math.round(response.data.wind.speed * 3.6));
    setDescription(response.data.weather[0].description);
    setIcon(response.data.weather[0].icon);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const city = event.target.elements.city.value;
    let apiKey = "3a94f3778290bfeee61278505dbbe51d";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    axios.get(url).then(showTemperature);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="search" placeholder="Type a city" name="city" />
        <input type="submit" value="Search" />
      </form>

      <div>
        <ul>
          <li>{temperature && <span>{Math.round(temperature)}°C</span>}</li>
          <li>{humidity && <span>Humidity: {humidity}%</span>}</li>
          <li>{windSpeed && <span>Wind Speed: {windSpeed} km/h</span>}</li>
          <li>
            {icon && (
              <span>
                <img
                  src={`http://openweathermap.org/img/wn/${icon}.png`}
                  alt={description}
                />
              </span>
            )}
          </li>
          <li>{description && <span>Description: {description}</span>}</li>
        </ul>
      </div>
    </>
  );
}

export default Weather;
