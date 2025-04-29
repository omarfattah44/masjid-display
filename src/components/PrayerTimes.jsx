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

  // Icon lookup for each prayer
  const iconMap = {
    Fajr:    FaMosque,
    Dhuhr:   FaSun,
    Asr:     FaCloudSun,
    Maghrib: FaMoon,
    Isha:    FaStarAndCrescent,
    "Jummah Khutba": FaMosque,
  };

  // Helper to add minutes to "HH:MM"
  function addMinutes(time, mins) {
    const [h, m] = time.split(":").map(Number);
    const dt = new Date();
    dt.setHours(h, m + mins, 0, 0);
    const hh = dt.getHours().toString().padStart(2, "0");
    const mm = dt.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }

  useEffect(() => {
    async function fetchAndCompute() {
      try {
        const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
          "Santa Maria"
        )}&country=USA&method=2`;
        const res  = await fetch(url);
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.status);

        const t = json.data.timings;
        setTimings(t);

        const order = ["Fajr","Dhuhr","Asr","Maghrib","Isha","Jummah Khutba"];
        const now   = new Date();
        let foundCurrent = null;
        let foundNext    = null;

        for (const prayer of order) {
          const adhan = prayer === "Jummah Khutba" ? t.Dhuhr : t[prayer];
          const [h, m] = adhan.split(":").map(Number);
          const dt = new Date(now);
          dt.setHours(h, m, 0, 0);

          if (dt <= now) foundCurrent = prayer;
          if (!foundNext && dt > now) foundNext = prayer;
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
    const iv = setInterval(fetchAndCompute, 300000); // refresh every 5m
    return () => clearInterval(iv);
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

  // Compute Iqāmah times
  const fajrIqama = addMinutes(timings.Fajr, 40);
  const duhrIqama = "13:30";
  const ishaIqama = addMinutes(timings.Isha, 10);

  const order = ["Fajr","Dhuhr","Asr","Maghrib","Isha","Jummah Khutba"];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Prayer Times for Santa Maria, CA</h2>
      <div className={styles.list}>
        {order.map((prayer) => {
          const Icon = iconMap[prayer] || FaTrafficLight;
          const adhan = prayer === "Jummah Khutba" ? timings.Dhuhr : timings[prayer];
          const isCur = prayer === currentPrayer;
          const isNxt = prayer === nextPrayer;

          return (
            <div
              key={prayer}
              className={`${styles.timeCard} ${
                isCur ? styles.current : isNxt ? styles.next : ""
              }`}
            >
              <Icon className={styles.icon} />
              <div className={styles.prayerName}>{prayer}</div>
              <div className={styles.time}>{adhan}</div>

              {prayer === "Jummah Khutba" && (
                <div className={styles.iqamaContainer}>
                  <div className={styles.iqamaLabel}>Khutbah</div>
                  <div className={styles.iqamaTime}>13:40</div>
                  <div className={styles.iqamaLabel}>Salah</div>
                  <div className={styles.iqamaTime}>14:10</div>
                </div>
              )}

              {prayer === "Fajr" && (
                <div className={styles.iqamaContainer}>
                  <div className={styles.iqamaLabel}>Iqama</div>
                  <div className={styles.iqamaTime}>{fajrIqama}</div>
                </div>
              )}
              {prayer === "Dhuhr" && (
                <div className={styles.iqamaContainer}>
                  <div className={styles.iqamaLabel}>Iqama</div>
                  <div className={styles.iqamaTime}>{duhrIqama}</div>
                </div>
              )}
              {prayer === "Isha" && (
                <div className={styles.iqamaContainer}>
                  <div className={styles.iqamaLabel}>Iqama</div>
                  <div className={styles.iqamaTime}>{ishaIqama}</div>
                </div>
              )}

              {isCur && <div>Current</div>}
              {isNxt && (
                <div style={{ color: "var(--color-secondary)" }}>Next</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
