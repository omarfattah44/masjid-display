// src/components/DailyVerse.jsx
import React, { useEffect, useState } from "react";
import styles from "./DailyVerse.module.css";

export default function DailyVerse() {
  const [verse, setVerse] = useState(null);
  const [error, setError] = useState(null);

  async function fetchVerse() {
    try {
      // Fetch a random Arabic ayah
      const arabicRes = await fetch("https://api.alquran.cloud/v1/ayah/random");
      const arabicJson = await arabicRes.json();
      if (arabicJson.code !== 200) throw new Error(arabicJson.status);

      const { text: arabicText, surah, numberInSurah: ayahNum } = arabicJson.data;
      const surahNum = surah.number;

      // Fetch the Sahih translation
      let englishText = "";
      try {
        const trRes = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/en.sahih`
        );
        const trJson = await trRes.json();
        if (trJson.code === 200) englishText = trJson.data.text;
      } catch {
        console.warn("Translation not found, showing Arabic only");
      }

      setVerse({
        arabic: arabicText,
        english: englishText,
        reference: `${surah.englishName} ${ayahNum}`,
      });
    } catch (err) {
      console.error("DailyVerse error:", err);
      setError("Unable to load verse.");
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchVerse();

    // Refresh every hour
    const intervalId = setInterval(fetchVerse, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <div className={styles.container}>
        <p style={{ color: "#f88", textAlign: "center" }}>{error}</p>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className={styles.container}>
        <p className={styles.arabic}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles.arabic} dir="rtl">
        {verse.arabic}
      </p>
      {verse.english && (
        <p className={styles.english}>"{verse.english}"</p>
      )}
      <p className={styles.reference}>{verse.reference}</p>
    </div>
  );
}

