// src/components/CountdownTimer.jsx
import React, { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./CountdownTimer.module.css";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let intervalId;

    async function initCountdown() {
      // 1) Fetch today’s prayer times
      const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        "Santa Maria"
      )}&country=${encodeURIComponent("USA")}&method=2`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.code !== 200) throw new Error(json.status);
      const timings = json.data.timings;
      const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

      // 2) Find previous & next prayer Date objects
      const now = new Date();
      let nextTime = null,
          prevTime = null,
          nextName = null;

      for (let i = 0; i < order.length; i++) {
        const name = order[i];
        const [h, m] = timings[name].split(":").map(Number);
        const dt = new Date(now);
        dt.setHours(h, m, 0, 0);
        if (dt > now && !nextTime) {
          nextTime = dt;
          nextName = name;
        }
        if (dt <= now) {
          prevTime = dt;
        }
      }
      // wrap around if needed
      if (!nextTime) {
        const [h, m] = timings.Fajr.split(":").map(Number);
        nextTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, h, m, 0);
      }
      if (!prevTime) {
        const [h, m] = timings.Isha.split(":").map(Number);
        prevTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, h, m, 0);
      }

      const totalDuration = nextTime - prevTime;

      // 3) Update loop
      function update() {
        const now = new Date();
        const remaining = nextTime - now;
        const hrs  = Math.floor(remaining / 1000 / 60 / 60);
        const mins = Math.floor((remaining / 1000 / 60) % 60);
        const secs = Math.floor((remaining / 1000) % 60);
        const pad = (n) => String(n).padStart(2, "0");
        setTimeLeft(`${pad(hrs)}:${pad(mins)}:${pad(secs)}`);

        const elapsed = totalDuration - remaining;
        const pct = (elapsed / totalDuration) * 100;
        setPercent(Math.min(Math.max(pct, 0), 100));
      }

      update();
      intervalId = setInterval(update, 1000);
    }

    initCountdown().catch(console.error);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
    <div className={styles.label}>Next Prayer In:</div>
    
      <div className={styles.counter}>
        <CircularProgressbar
          value={percent}
          text={timeLeft}
          styles={buildStyles({
            pathColor: "var(--color-secondary)",
            textColor: "var(--color-text)",
            trailColor: "#e6e6e6",
            backgroundColor: "var(--color-card-bg)",
          })}
        />
      </div>
    </div>
  );
}

