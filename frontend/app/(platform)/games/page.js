"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveGameScore } from "@/services/firestoreService";
import { trackEvent } from "@/services/analytics";
import { GAME_ITEMS } from "@/constants/data";
import styles from "./GamesPage.module.css";

export default function GamesPage() {
  const { user } = useAuth();
  const [dragResult, setDragResult] = useState({ animals: [], vehicles: [] });
  const [treeAnswer, setTreeAnswer] = useState("");
  const [sortValues, setSortValues] = useState([18, 3, 9, 27, 12]);
  const [message, setMessage] = useState("");

  const gameOneScore = useMemo(() => {
    let score = 0;
    GAME_ITEMS.classify.forEach((item) => {
      if (dragResult[item.target].includes(item.id)) score += 1;
    });
    return score;
  }, [dragResult]);

  const onDrop = (bucket, ev) => {
    const itemId = ev.dataTransfer.getData("text/plain");
    if (!itemId) return;

    setDragResult((prev) => {
      const next = {
        animals: prev.animals.filter((id) => id !== itemId),
        vehicles: prev.vehicles.filter((id) => id !== itemId),
      };
      next[bucket] = [...next[bucket], itemId];
      return next;
    });
  };

  const submitScores = async () => {
    const gameTwo = treeAnswer === "apple" ? 1 : 0;
    const sorted = [...sortValues].sort((a, b) => a - b).join(",");
    const gameThree = sortValues.join(",") === sorted ? 1 : 0;
    const total = gameOneScore + gameTwo + gameThree;

    try {
      await saveGameScore(user.uid, "mini_games", total);
      trackEvent("games_attempted", { uid: user.uid, score: total });
      setMessage(`Score submitted: ${total}/6`);
    } catch (err) {
      console.error(err);
      setMessage("Could not save score.");
    }
  };

  const shuffleSort = () => {
    const shuffled = [...sortValues].sort(() => Math.random() - 0.5);
    setSortValues(shuffled);
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">AIML Mini-Games</h1>
        <p className="page-subtitle">Play logic challenges to sharpen model intuition.</p>
      </header>

      <article className={`card ${styles.card}`}>
        <h3>Game 1: Classify Objects (Drag & Drop)</h3>
        <div className={styles.dragGrid}>
          <div className={styles.items}>
            {GAME_ITEMS.classify.map((item) => (
              <button
                key={item.id}
                draggable
                onDragStart={(ev) => ev.dataTransfer.setData("text/plain", item.id)}
                className={styles.draggable}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          {["animals", "vehicles"].map((bucket) => (
            <div
              key={bucket}
              className={styles.bucket}
              onDragOver={(ev) => ev.preventDefault()}
              onDrop={(ev) => onDrop(bucket, ev)}
            >
              <strong>{bucket}</strong>
              <p>{dragResult[bucket].join(", ") || "Drop items here"}</p>
            </div>
          ))}
        </div>
      </article>

      <article className={`card ${styles.card}`}>
        <h3>Game 2: Decision Tree Choice</h3>
        <p>If color is red and shape is round, classify as:</p>
        <div className={styles.optionRow}>
          {[
            ["apple", "Apple"],
            ["carrot", "Carrot"],
            ["bike", "Bike"],
          ].map(([value, label]) => (
            <label key={value}>
              <input type="radio" value={value} checked={treeAnswer === value} onChange={(e) => setTreeAnswer(e.target.value)} />
              {label}
            </label>
          ))}
        </div>
      </article>

      <article className={`card ${styles.card}`}>
        <h3>Game 3: Dataset Sorting Challenge</h3>
        <p>Sort these numbers ascending by clicking a number to move it right.</p>
        <div className={styles.sortRow}>
          {sortValues.map((value, idx) => (
            <button
              key={`${value}-${idx}`}
              className={styles.sortButton}
              onClick={() => {
                const next = [...sortValues];
                if (idx < next.length - 1) {
                  [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                  setSortValues(next);
                }
              }}
              type="button"
            >
              {value}
            </button>
          ))}
        </div>
        <button className="button-secondary" type="button" onClick={shuffleSort}>
          Shuffle
        </button>
      </article>

      <div className={styles.submitRow}>
        <button className="button-primary" type="button" onClick={submitScores}>
          Submit Game Scores
        </button>
        {message && <span>{message}</span>}
      </div>
    </section>
  );
}
