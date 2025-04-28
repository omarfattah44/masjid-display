// src/components/Card.jsx
import React from "react";
import styles from "./Card.module.css";

export default function Card({ children, className }) {
  // Merge the module's .card with any extra classes (e.g. styles.header)
  const combo = `${styles.card} ${className || ""}`.trim();
  return <div className={combo}>{children}</div>;
}
