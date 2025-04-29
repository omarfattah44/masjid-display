// src/App.jsx
import React from "react";
import Card from "./components/Card";
import cardStyles from "./components/Card.module.css";
import PrayerTimes    from "./components/PrayerTimes";
import CountdownTimer from "./components/CountdownTimer";
import DailyVerse     from "./components/DailyVerse";
import Announcements  from "./components/Announcements";
import WeatherWidget  from "./components/WeatherWidget";
import logo           from "./assets/logo.png";    // ← NEW
import "./index.css";

export default function App() {
  return (
    <div className="app-container">
      <div className="grid-layout">
        {/* 1. Header with imported logo */}
        <Card className={cardStyles.header}>
          <img src={logo} alt="CCIC Logo" className={cardStyles.logo} />
          <div style={{ flex: 1, textAlign: "center" }}>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "2.5rem",
                marginBottom: "8px",
              }}
            >
              Central Coast Islamic Center
            </h1>
            <p style={{ color: "var(--color-secondary)", fontSize: "2rem", fontWeight: "bold", marginBottom: "4px" }}>
              CCIC of Santa Maria
            </p>
            <p style={{ fontSize: "2rem" }}>
              Prayer Times & Community Announcements
            </p>
          </div>
          <img
            src={logo}
            alt="CCIC Logo"
            className={cardStyles.logo}
          />
        </Card>

        {/* 2. Prayer Times */}
        <Card><PrayerTimes /></Card>
        {/* 3. Countdown */}
        <Card><CountdownTimer /></Card>
        {/* 4. Daily Verse */}
        <Card><DailyVerse /></Card>
        {/* 5. Announcements */}
        <Card><Announcements /></Card>
        {/* 6. Weather */}
        <Card><WeatherWidget /></Card>
      </div>
    </div>
  );
}
