// src/components/PrayerTimes.jsx
import React, { useEffect, useState } from "react";
import {
  FaMosque,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaStarAndCrescent,
  FaTrafficLight,
} from "react-icons/fa";
import styles from "./PrayerTimes.module.css";

export default function PrayerTimes() {
  const [timings, setTimings] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [error, setError] = useState(null);

  // Map prayer names to icons
  const iconMap = {
    Fajr: FaMosque,
    Dhuhr: FaSun,
    Asr: FaCloudSun,
    Maghrib: FaMoon,
    Isha: FaStarAndCrescent,
  };

  useEffect(() => {
    async function fetchAndCompute() {
      try {
        const city    = encodeURIComponent("Santa Maria");
        const country = encodeURIComponent("USA");
        const method  = 2;
        const url     = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=${method}`;

        const res  = await fetch(url);
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.status);

        const t = json.data.timings;
        setTimings(t);

        const order = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
        const now   = new Date();
        let foundCurrent = null;
        let foundNext    = null;

        for (let i = 0; i < order.length; i++) {
          const name = order[i];
          const [h, m] = t[name].split(":").map(Number);
          const dt = new Date(now);
          dt.setHours(h, m, 0, 0);

          if (dt <= now) {
            foundCurrent = name;
          }
          if (!foundNext && dt > now) {
            foundNext = name;
          }
        }

        if (!foundNext) foundNext = "Fajr";

        setCurrentPrayer(foundCurrent);
        setNextPrayer(foundNext);
      } catch (err) {
        console.error(err);
        setError("Unable to load prayer times.");
      }
    }

    fetchAndCompute();
    const interval = setInterval(fetchAndCompute, 300000); // refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Prayer Times</h2>
        <p style={{ textAlign: "center", color: "#f88" }}>{error}</p>
      </div>
    );
  }

  if (!timings) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Prayer Times</h2>
        <p style={{ textAlign: "center" }}>Loading…</p>
      </div>
    );
  }

  const order = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Prayer Times for Santa Maria, CA</h2>
      <div className={styles.list}>
        {order.map((prayer) => {
          const Icon = iconMap[prayer] || FaTrafficLight;
          const isCurrent = prayer === currentPrayer;
          const isNext    = prayer === nextPrayer;

          return (
            <div
              key={prayer}
              className={`${styles.timeCard} ${
                isCurrent ? styles.current :
                isNext    ? styles.next : ""
              }`}
            >
              <Icon className={styles.icon} />
              <div className={styles.prayerName}>{prayer}</div>
              <div className={styles.time}>{timings[prayer]}</div>
              {isCurrent && <div>Current</div>}
              {isNext    && <div style={{ color: "var(--color-secondary)" }}>Next</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}


