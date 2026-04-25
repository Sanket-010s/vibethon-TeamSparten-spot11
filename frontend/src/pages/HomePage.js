import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ChartNoAxesCombined, CodeXml } from 'lucide-react';
import styles from '../styles/HomePage.module.css';

export default function HomePage() {
  return (
    <main className={styles.pageWrap}>
      <div className={styles.heroSection}>
        <div className="container">
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={styles.hero}>
            <div className={styles.heroInner}>
              <div className={styles.heroContent}>
                <h1>AIML Nexus: Learn, Code, Play, and Visualize <span className={styles.aiHighlight}>AI</span> in One Platform</h1>
                <p>A startup-grade MVP for AI/ML education with Firebase auth, real-time dashboard insights, quizzes, mini-games, and an AI Tutor for instant concept explanation.</p>
                <div className={styles.actions}>
                  <Link to="/auth" className="button-primary">Sign In</Link>
                </div>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.visualGlow} />
                <div className={styles.visualOrbital} />
                <div className={styles.visualHeader}>AIML Command Center</div>
                <div className={styles.visualStack}>
                  <div className={styles.visualPanel}>
                    <Brain size={18} />
                    <div className={styles.visualBars}><span /><span /><span /></div>
                  </div>
                  <div className={styles.visualPanel}>
                    <CodeXml size={18} />
                    <div className={styles.visualBars}><span /><span /><span /></div>
                  </div>
                  <div className={styles.visualPanel}>
                    <ChartNoAxesCombined size={18} />
                    <div className={styles.visualBars}><span /><span /><span /></div>
                  </div>
                </div>
                <div className={styles.visualFooter}>
                  <span>Realtime Progress</span>
                  <span>AI Tutor Ready</span>
                  <span>Game Insights</span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
