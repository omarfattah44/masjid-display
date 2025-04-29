// src/components/WeatherWidget.jsx
import React, { useEffect, useState } from "react";
import {
  WiDaySunny,
  WiNightClear,
  WiCloud,
  WiRain,
  WiShowers,
  WiSnow,
  WiThunderstorm,
  WiFog,
} from "react-icons/wi";
import styles from "./WeatherWidget.module.css";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [error, setError] = useState(null);

  // Map Open-Meteo codes to icons
  const iconMap = {
    0: WiDaySunny, 1: WiDaySunny,
    2: WiCloud, 3: WiCloud,
    45: WiFog, 48: WiFog,
    51: WiShowers, 53: WiShowers, 55: WiShowers,
    61: WiRain, 63: WiRain, 65: WiRain,
    71: WiSnow, 73: WiSnow, 75: WiSnow,
    80: WiShowers, 81: WiShowers, 82: WiShowers,
    95: WiThunderstorm, 96: WiThunderstorm, 99: WiThunderstorm,
  };

  useEffect(() => {
    async function fetchWeather() {
      try {
        const latitude  = 34.9530;
        const longitude = -120.4357;
        // include sunrise/sunset to detect day/night
        const url =
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
          `&longitude=${longitude}&current_weather=true` +
          `&daily=sunrise,sunset&timezone=America%2FLos_Angeles`;

        const res  = await fetch(url);
        const json = await res.json();
        if (!json.current_weather || !json.daily) {
          throw new Error("Incomplete weather data");
        }

        const { temperature: celsius, weathercode } = json.current_weather;
        const { sunrise, sunset } = json.daily;
        const now = new Date();
        const sunriseToday = new Date(sunrise[0]);
        const sunsetToday  = new Date(sunset[0]);
        setIsDay(now >= sunriseToday && now < sunsetToday);

        // Convert °C to °F
        const fahrenheit = Math.round(celsius * 9/5 + 32);

        setWeather({
          location: "Santa Maria, CA",
          temp: `${fahrenheit}°F`,
          code: weathercode,
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Unable to load weather.");
      }
    }

    fetchWeather();
    const id = setInterval(fetchWeather, 600000); // refresh every 10m
    return () => clearInterval(id);
  }, []);

  const containerClass = `${styles.container} ${isDay ? styles.day : styles.night}`;

  if (error) {
    return (
      <div className={containerClass}>
        <p style={{ textAlign: "center", color: "#f88" }}>{error}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className={containerClass}>
        <p>Loading weather…</p>
      </div>
    );
  }

  const Icon = iconMap[weather.code] || (isDay ? WiDaySunny : WiNightClear);

  return (
    <div className={containerClass}>
      <Icon className={styles.icon} />
      <div className={styles.location}>{weather.location}</div>
      <div className={styles.temp}>{weather.temp}</div>
      <div className={styles.condition} />
    </div>
  );
}

