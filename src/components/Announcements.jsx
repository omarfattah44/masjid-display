import React, { useEffect, useState } from "react";
import styles from "./Announcements.module.css";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // TODO: replace static list with your own data source
    setAnnouncements([
      { id: 1, text: "📢 Jum'a Khutbah at 1:15 PM in the main hall." },
      { id: 2, text: "🕋 Ramadan Iftar starts daily at sunset." },
      { id: 3, text: "🎉 Eid al-Fitr celebration on April 10 at 9 AM." },
      { id: 4, text: "🤝 Community potluck next Saturday at 6 PM." },
    ]);
  }, []);

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Announcements</div>
      <div className={styles.grid}>
        {announcements.map((a) => (
          <div key={a.id} className={styles.item}>
            {a.text}
          </div>
        ))}
      </div>
    </div>
  );
}
