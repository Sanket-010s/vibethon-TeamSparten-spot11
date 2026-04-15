"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./ModulesPage.module.css";

/* SAMPLE DATA */
const ML_MODULES = [
  {
    id: "m1",
    title: "Introduction to Machine Learning",
    level: "Beginner",
    duration: "15 min",
    summary: "Understand the fundamentals of ML and how machines learn from data",
    highlights: ["What is ML?", "Types of Learning", "Real-world Applications"],
    icon: "🤖",
    color: "#6366f1",
  },
  {
    id: "m2",
    title: "Supervised Learning",
    level: "Beginner",
    duration: "20 min",
    summary: "Learn how algorithms learn from labeled data to make predictions",
    highlights: ["Classification", "Regression", "Training & Testing"],
    icon: "📊",
    color: "#8b5cf6",
  },
  {
    id: "m3",
    title: "Unsupervised Learning",
    level: "Intermediate",
    duration: "20 min",
    summary: "Discover patterns in data without labeled examples",
    highlights: ["Clustering", "Dimensionality Reduction", "Anomaly Detection"],
    icon: "🔍",
    color: "#ec4899",
  },
  {
    id: "m4",
    title: "Neural Networks",
    level: "Intermediate",
    duration: "25 min",
    summary: "Explore brain-inspired models that power deep learning",
    highlights: ["Neurons & Layers", "Activation Functions", "Backpropagation"],
    icon: "🧠",
    color: "#f59e0b",
  },
  {
    id: "m5",
    title: "Deep Learning",
    level: "Advanced",
    duration: "30 min",
    summary: "Master advanced neural network architectures and techniques",
    highlights: ["CNNs", "RNNs", "Transfer Learning"],
    icon: "⚡",
    color: "#10b981",
  },
  {
    id: "m6",
    title: "Natural Language Processing",
    level: "Advanced",
    duration: "25 min",
    summary: "Teach machines to understand and generate human language",
    highlights: ["Text Processing", "Sentiment Analysis", "Transformers"],
    icon: "💬",
    color: "#06b6d4",
  },
  {
    id: "m7",
    title: "Computer Vision",
    level: "Advanced",
    duration: "25 min",
    summary: "Enable machines to see and interpret visual information",
    highlights: ["Image Classification", "Object Detection", "Image Segmentation"],
    icon: "👁️",
    color: "#ef4444",
  },
];

export default function ModulesPage() {
  const [completed, setCompleted] = useState([]);
  const [busyModule, setBusyModule] = useState("");
  const [selectedModule, setSelectedModule] = useState(null);

  const completedSet = new Set(completed);

  const markDone = (id) => {
    setBusyModule(id);
    setTimeout(() => {
      setCompleted((prev) => [...prev, id]);
      setBusyModule("");
    }, 800);
  };

  return (
    <div className={styles.pageWrap}>
      {/* HERO */}
      <motion.header 
        className={styles.hero}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.heroTitle}>
          Master <span className={styles.gradient}>AI & Machine Learning</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Interactive modules designed to take you from beginner to expert
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{ML_MODULES.length}</span>
            <span className={styles.statLabel}>Modules</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{completed.length}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{Math.round((completed.length / ML_MODULES.length) * 100)}%</span>
            <span className={styles.statLabel}>Progress</span>
          </div>
        </div>
      </motion.header>

      {/* PROGRESS BAR */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <motion.div 
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${(completed.length / ML_MODULES.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* MODULES GRID */}
      <div className={styles.modulesGrid}>
        {ML_MODULES.map((module, idx) => {
          const done = completedSet.has(module.id);

          return (
            <motion.article
              key={module.id}
              className={`${styles.moduleCard} ${done ? styles.completed : ""}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => setSelectedModule(module)}
            >
              {/* Status Badge */}
              {done && <div className={styles.completedBadge}>✓ Completed</div>}
              
              {/* Icon */}
              <div className={styles.moduleIcon} style={{ background: `${module.color}15` }}>
                <span style={{ fontSize: "2.5rem" }}>{module.icon}</span>
              </div>

              {/* Content */}
              <div className={styles.moduleContent}>
                <div className={styles.moduleHeader}>
                  <h3 className={styles.moduleTitle}>{module.title}</h3>
                  <div className={styles.moduleMeta}>
                    <span className={styles.levelBadge} style={{ background: `${module.color}20`, color: module.color }}>
                      {module.level}
                    </span>
                    <span className={styles.duration}>⏱️ {module.duration}</span>
                  </div>
                </div>

                <p className={styles.moduleSummary}>{module.summary}</p>

                {/* Highlights */}
                <ul className={styles.highlights}>
                  {module.highlights.map((item) => (
                    <li key={item}>
                      <span className={styles.checkmark}>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                className={done ? styles.btnCompleted : styles.btnStart}
                disabled={done || busyModule === module.id}
                onClick={(e) => {
                  e.stopPropagation();
                  markDone(module.id);
                }}
                style={{ background: done ? "#10b981" : module.color }}
              >
                {done ? "✓ Completed" : busyModule === module.id ? "Saving..." : "Start Learning"}
              </button>
            </motion.article>
          );
        })}
      </div>

      {/* Module Detail Modal */}
      {selectedModule && (
        <motion.div 
          className={styles.modal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedModule(null)}
        >
          <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={() => setSelectedModule(null)}>✕</button>
            <div className={styles.modalIcon} style={{ background: `${selectedModule.color}15` }}>
              <span style={{ fontSize: "3rem" }}>{selectedModule.icon}</span>
            </div>
            <h2>{selectedModule.title}</h2>
            <p className={styles.modalSummary}>{selectedModule.summary}</p>
            <div className={styles.modalMeta}>
              <span className={styles.levelBadge} style={{ background: `${selectedModule.color}20`, color: selectedModule.color }}>
                {selectedModule.level}
              </span>
              <span className={styles.duration}>⏱️ {selectedModule.duration}</span>
            </div>
            <h4>What you'll learn:</h4>
            <ul className={styles.modalHighlights}>
              {selectedModule.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button 
              className={styles.btnStartModal}
              style={{ background: selectedModule.color }}
              onClick={() => {
                markDone(selectedModule.id);
                setSelectedModule(null);
              }}
            >
              Start Learning
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
