import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { completeModule } from '../services/firestoreService';
import { trackEvent } from '../services/analytics';
import styles from '../styles/ModulesPage.module.css';

const ML_MODULES = [
  { id: 'm1', title: 'Introduction to Machine Learning', level: 'Beginner', duration: '15 min', summary: 'Understand the fundamentals of ML and how machines learn from data', highlights: ['What is ML?', 'Types of Learning', 'Real-world Applications'], icon: '🤖', color: '#6366f1' },
  { id: 'm2', title: 'Supervised Learning', level: 'Beginner', duration: '20 min', summary: 'Learn how algorithms learn from labeled data to make predictions', highlights: ['Classification', 'Regression', 'Training & Testing'], icon: '📊', color: '#8b5cf6' },
  { id: 'm3', title: 'Unsupervised Learning', level: 'Intermediate', duration: '20 min', summary: 'Discover patterns in data without labeled examples', highlights: ['Clustering', 'Dimensionality Reduction', 'Anomaly Detection'], icon: '🔍', color: '#ec4899' },
  { id: 'm4', title: 'Neural Networks', level: 'Intermediate', duration: '25 min', summary: 'Explore brain-inspired models that power deep learning', highlights: ['Neurons & Layers', 'Activation Functions', 'Backpropagation'], icon: '🧠', color: '#f59e0b' },
];

export default function ModulesPage() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState([]);
  const [busyModule, setBusyModule] = useState('');

  const markDone = async (id) => {
    setBusyModule(id);
    try {
      await completeModule(user.uid, id);
      trackEvent('module_completed', { uid: user.uid, moduleId: id });
      setCompleted((prev) => [...prev, id]);
    } catch (err) {
      console.error(err);
    } finally {
      setBusyModule('');
    }
  };

  return (
    <div className={styles.pageWrap}>
      <motion.header className={styles.hero} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.heroTitle}>Master <span className={styles.gradient}>AI & Machine Learning</span></h1>
        <p className={styles.heroSubtitle}>Interactive modules designed to take you from beginner to expert</p>
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

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <motion.div className={styles.progressFill} initial={{ width: 0 }} animate={{ width: `${(completed.length / ML_MODULES.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <div className={styles.modulesGrid}>
        {ML_MODULES.map((module, idx) => {
          const done = completed.includes(module.id);
          return (
            <motion.article
              key={module.id}
              className={`${styles.moduleCard} ${done ? styles.completed : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              {done && <div className={styles.completedBadge}>✓ Completed</div>}
              <div className={styles.moduleIcon} style={{ background: `${module.color}15` }}>
                <span style={{ fontSize: '2.5rem' }}>{module.icon}</span>
              </div>
              <div className={styles.moduleContent}>
                <div className={styles.moduleHeader}>
                  <h3 className={styles.moduleTitle}>{module.title}</h3>
                  <div className={styles.moduleMeta}>
                    <span className={styles.levelBadge} style={{ background: `${module.color}20`, color: module.color }}>{module.level}</span>
                    <span className={styles.duration}>⏱️ {module.duration}</span>
                  </div>
                </div>
                <p className={styles.moduleSummary}>{module.summary}</p>
                <ul className={styles.highlights}>
                  {module.highlights.map((item) => (
                    <li key={item}><span className={styles.checkmark}>→</span>{item}</li>
                  ))}
                </ul>
              </div>
              <button
                className={done ? styles.btnCompleted : styles.btnStart}
                disabled={done || busyModule === module.id}
                onClick={() => markDone(module.id)}
                style={{ background: done ? '#10b981' : module.color }}
              >
                {done ? '✓ Completed' : busyModule === module.id ? 'Saving...' : 'Start Learning'}
              </button>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
