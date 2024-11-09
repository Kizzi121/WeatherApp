// WeatherChecker.js
import React, { useState } from 'react';
import axios from 'axios';
import './WeatherChecker.css';

const API_KEY = 'c60ffa7cb5dee77f4e2c0b735f634d15';

function WeatherChecker() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const fetchWeather = async () => {
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    try {
      setError('');
      // Step 1: Fetch weather data to get latitude and longitude
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      setWeatherData(weatherResponse.data);

      const { lat, lon } = weatherResponse.data.coord;

      // Step 2: Fetch air quality data using latitude and longitude
      const airQualityResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      setAirQualityData(airQualityResponse.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Error fetching weather or air quality data');
    }
  };

  // Function to determine the level of smoke
  const getSmokeLevel = (pmValue) => {
    if (pmValue <= 50) {
      return 'Good (Low Smoke)';
    } else if (pmValue <= 100) {
      return 'Moderate (Some Smoke)';
    } else if (pmValue <= 200) {
      return 'Unhealthy (High Smoke)';
    } else {
      return 'Very Unhealthy (Severe Smoke)';
    }
  };

  // Clear all data
  const clearWeather = () => {
    setCity('');
    setWeatherData(null);
    setAirQualityData(null);
    setError('');
  };

  return (
    <div className="app-container">
      <h1 className="title">Global Weather & Air Quality Checker</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={handleInputChange}
          className="city-input"
        />
        <button onClick={fetchWeather} className="search-button">
          Get Weather
        </button>
        <button onClick={clearWeather} className="clear-button">
          Clear
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {weatherData && (
        <div className="weather-display">
          <h2 className="city-name">{weatherData.name}</h2>
          <p className="temperature">Current Temp: {weatherData.main.temp}°C</p>
          <p className="description">
            {weatherData.weather[0].description}
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather icon"
              className="weather-icon"
            />
          </p>
          {airQualityData && (
            <div className="air-quality">
              <h3>Air Quality (Smoke Levels):</h3>
              <p>PM2.5: {airQualityData.list[0].components.pm2_5} µg/m³</p>
              <p>PM10: {airQualityData.list[0].components.pm10} µg/m³</p>
              <p>Smoke Level (PM2.5): {getSmokeLevel(airQualityData.list[0].components.pm2_5)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WeatherChecker;
