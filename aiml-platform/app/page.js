"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, ChartNoAxesCombined, CodeXml, Gamepad2, Sparkles } from "lucide-react";
import styles from "./HomePage.module.css";

const features = [
  {
    icon: Brain,
    title: "Learn AIML Fast",
    text: "Digestible visual modules for machine learning fundamentals.",
  },
  {
    icon: CodeXml,
    title: "Practice by Building",
    text: "Interactive Python playground with preloaded ML snippets.",
  },
  {
    icon: Gamepad2,
    title: "Play to Understand",
    text: "Mini-games that convert concepts into hands-on intuition.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Track Real Progress",
    text: "Realtime dashboard with charts, heatmap, scores, and streaks.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.heroWrap}>
      <div className="container">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.hero}
        >
          <span className="chip">
            <Sparkles size={14} />
            Hackathon-Ready AI Learning Experience
          </span>
          <h1>AIML Nexus: Learn, Code, Play, and Visualize AI in One Platform</h1>
          <p>
            A startup-grade MVP for AI/ML education with Firebase auth, real-time dashboard insights,
            quizzes, mini-games, and an AI Tutor for instant concept explanation.
          </p>
          <div className={styles.actions}>
            <Link href="/auth" className="button-primary" aria-label="Start learning now">
              Get Started
            </Link>
            <Link href="/dashboard" className="button-secondary" aria-label="Open demo dashboard">
              View Demo Flow
            </Link>
          </div>
        </motion.section>

        <section className={styles.featureGrid}>
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={`card ${styles.featureCard}`}
              >
                <div className={styles.featureIcon}>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
