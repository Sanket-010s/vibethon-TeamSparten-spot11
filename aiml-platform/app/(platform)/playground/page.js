"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { PYTHON_SNIPPET } from "@/lib/sampleData";
import styles from "./PlaygroundPage.module.css";

export default function PlaygroundPage() {
  const { user } = useAuth();
  const [code, setCode] = useState(PYTHON_SNIPPET);
  const [output, setOutput] = useState("");
  const [dataset, setDataset] = useState([]);
  const [loadingSet, setLoadingSet] = useState(false);

  const fakeOutput = useMemo(
    () => `Running classification simulation...\nUser: ${user?.email || "demo"}\nModel: LogisticRegression\nAccuracy: ${(0.81 + Math.random() * 0.14).toFixed(2)}\nStatus: Completed`,
    [user]
  );

  const runCode = () => {
    setOutput(fakeOutput);
  };

  const loadDataset = async () => {
    setLoadingSet(true);
    try {
      const res = await fetch("/api/dataset");
      const data = await res.json();
      setDataset(data.points || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load dataset API.");
    } finally {
      setLoadingSet(false);
    }
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">Coding Playground</h1>
        <p className="page-subtitle">Experiment with preloaded Python classification snippets.</p>
      </header>

      <div className={styles.grid}>
        <article className={`card ${styles.editorCard}`}>
          <h3>Python Editor (MVP Mock)</h3>
          <textarea
            className="textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            aria-label="Python code editor"
          />
          <div className={styles.actions}>
            <button type="button" className="button-primary" onClick={runCode}>
              Run Code
            </button>
            <button type="button" className="button-secondary" onClick={loadDataset} disabled={loadingSet}>
              {loadingSet ? "Loading API..." : "Load Dataset API"}
            </button>
          </div>
        </article>

        <motion.article className={`card ${styles.outputCard}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>Output Console</h3>
          <pre>{output || "Click Run Code to see simulation output."}</pre>
          <h4>Dataset API Preview</h4>
          {dataset.length === 0 ? (
            <p>No dataset loaded yet.</p>
          ) : (
            <ul>
              {dataset.slice(0, 8).map((row) => (
                <li key={row.id}>
                  Feature: {row.feature} | Label: {row.label}
                </li>
              ))}
            </ul>
          )}
        </motion.article>
      </div>
    </section>
  );
}
