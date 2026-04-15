"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { completeModule } from "@/lib/firestoreService";
import { trackEvent } from "@/lib/analytics";
import { ML_MODULES } from "@/lib/sampleData";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./ModulesPage.module.css";

export default function ModulesPage() {
  const { user } = useAuth();
  const { progress, loading } = useUserProgress(user?.uid);
  const [busyModule, setBusyModule] = useState("");

  if (loading || !progress) {
    return <LoadingSpinner label="Loading modules" />;
  }

  const completedSet = new Set(progress.completedModules || []);

  const markDone = async (moduleId) => {
    setBusyModule(moduleId);
    try {
      await completeModule(user.uid, moduleId);
      trackEvent("module_completed", { moduleId, uid: user.uid });
    } catch (err) {
      console.error(err);
      alert("Unable to mark module complete.");
    } finally {
      setBusyModule("");
    }
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">AIML Learning Modules</h1>
        <p className="page-subtitle">Learn with concise visual breakdowns and complete each module.</p>
      </header>

      <div className={styles.grid}>
        {ML_MODULES.map((module, idx) => {
          const done = completedSet.has(module.id);
          return (
            <motion.article
              key={module.id}
              className={`card ${styles.card}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <div className={styles.cardHead}>
                <h3>{module.title}</h3>
                <span className="chip">{module.level}</span>
              </div>
              <p>{module.summary}</p>

              <div className={styles.diagram} aria-label="Concept diagram">
                <div>Input Data</div>
                <span>-&gt;</span>
                <div>Model Learning</div>
                <span>-&gt;</span>
                <div>Prediction</div>
              </div>

              <ul>
                {module.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <button
                type="button"
                className={done ? "button-secondary" : "button-primary"}
                disabled={done || busyModule === module.id}
                onClick={() => markDone(module.id)}
              >
                {done ? "Completed" : busyModule === module.id ? "Saving..." : "Mark as Completed"}
              </button>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
