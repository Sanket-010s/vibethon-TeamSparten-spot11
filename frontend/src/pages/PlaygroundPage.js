import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PYTHON_SNIPPET } from '../constants/data';
import styles from '../styles/PlaygroundPage.module.css';

const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/';
let pyodideLoaderPromise = null;

async function loadPyodideRuntime() {
  if (typeof window === 'undefined') throw new Error('Python runtime is only available in the browser.');
  if (window.pyodide) return window.pyodide;
  if (!pyodideLoaderPromise) {
    pyodideLoaderPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${PYODIDE_INDEX_URL}pyodide.js`;
      script.async = true;
      script.onload = async () => {
        try {
          const runtime = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
          window.pyodide = runtime;
          resolve(runtime);
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => reject(new Error('Failed to load the Python runtime.'));
      document.head.appendChild(script);
    });
  }
  return pyodideLoaderPromise;
}

const SPAM_KEYWORDS = ['free', 'win', 'urgent', 'limited', 'claim', 'prize', 'offer', 'cash'];

export default function PlaygroundPage() {
  const { user } = useAuth();
  const [code, setCode] = useState(PYTHON_SNIPPET);
  const [output, setOutput] = useState('');
  const [runtimeState, setRuntimeState] = useState('Ready to execute Python code in the browser.');
  const [running, setRunning] = useState(false);
  const [spamInput, setSpamInput] = useState('Claim your free prize now and win cash today!');
  const [spamResult, setSpamResult] = useState(null);
  const [spamAnalyzing, setSpamAnalyzing] = useState(false);

  const runCode = async () => {
    setRunning(true);
    setRuntimeState('Loading Python runtime...');
    try {
      const pyodide = await loadPyodideRuntime();
      const stdout = [];
      pyodide.setStdout({ batched: (text) => stdout.push(text) });
      const result = await pyodide.runPythonAsync(code);
      const chunks = [`User: ${user?.email || 'demo'}`, ...stdout, ...(result !== undefined && result !== null && String(result).trim() ? [String(result)] : [])];
      setOutput(chunks.join('\n').trim() || 'Execution complete.');
      setRuntimeState('Python executed successfully in-browser.');
    } catch (error) {
      setOutput(`Execution failed: ${error.message}`);
      setRuntimeState('Python runtime failed to start.');
    } finally {
      setRunning(false);
    }
  };

  const analyzeSpam = async () => {
    setSpamAnalyzing(true);
    setSpamResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const normalized = spamInput.toLowerCase();
    const matches = SPAM_KEYWORDS.filter((word) => normalized.includes(word));
    const score = Math.min(98, 18 + matches.length * 20 + (normalized.includes('!') ? 8 : 0));
    const verdict = score >= 50 ? 'Spam' : 'Legit message';
    setSpamResult({ score, verdict, matches });
    setSpamAnalyzing(false);
  };

  return (
    <section className={styles.wrap}>
      <header>
        <h1 className="page-title">Coding Playground</h1>
        <p className="page-subtitle">Run Python in-browser and watch AI algorithms work in real-time.</p>
      </header>

      <div className={styles.grid}>
        <article className={`card ${styles.editorCard}`}>
          <h3>Python Editor</h3>
          <textarea className="textarea" value={code} onChange={(e) => setCode(e.target.value)} rows={14} />
          <div className={styles.actions}>
            <button type="button" className="button-primary" onClick={runCode} disabled={running}>
              {running ? 'Running...' : 'Run Code'}
            </button>
          </div>
          <p className={styles.runtimeState}>{runtimeState}</p>
        </article>

        <motion.article className={`card ${styles.outputCard}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3>Output Console</h3>
          <pre>{output || 'Click Run Code to see simulation output.'}</pre>
        </motion.article>
      </div>

      <article className={`card ${styles.simulationCard}`}>
        <h3>🔍 Spam Detection Demo</h3>
        <p>Watch how the algorithm analyzes text for spam patterns.</p>
        <textarea className="textarea" rows={4} value={spamInput} onChange={(e) => setSpamInput(e.target.value)} />
        <div className={styles.actions}>
          <button type="button" className="button-primary" onClick={analyzeSpam} disabled={spamAnalyzing}>
            {spamAnalyzing ? 'Analyzing...' : 'Analyze Message'}
          </button>
        </div>
        <AnimatePresence>
          {spamResult && (
            <motion.div className={styles.simulationResult} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
              <div className={styles.resultHeader}>
                <strong>{spamResult.verdict}</strong>
                <motion.div className={styles.scoreBar} initial={{ width: 0 }} animate={{ width: `${spamResult.score}%` }} transition={{ duration: 0.8, delay: 0.3 }} style={{ background: spamResult.score >= 50 ? '#ef4444' : '#10b981' }} />
                <span>Spam score: {spamResult.score}%</span>
              </div>
              <p>{spamResult.matches.length ? `Matched keywords: ${spamResult.matches.join(', ')}` : 'No spam keywords matched.'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </section>
  );
}
