import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { GitFork } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/AuthPage.module.css';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name too short'),
  skillLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [githubBusy, setGithubBusy] = useState(false);
  const { login, signup, loginWithGoogle, loginWithGitHub, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  const schema = mode === 'login' ? loginSchema : signupSchema;
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(values);
      } else {
        await signup(values);
      }
      navigate('/modules');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleBusy(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/modules');
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleGitHubLogin = async () => {
    setGithubBusy(true);
    setError('');
    try {
      await loginWithGitHub();
      navigate('/modules');
    } catch (err) {
      setError(err.message || 'GitHub login failed');
    } finally {
      setGithubBusy(false);
    }
  };

  return (
    <main className={styles.wrap}>
      <div className={styles.authContainer}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className={styles.authCard}>
          <h2>Welcome to AIML Nexus</h2>
          <p className={styles.authSubtitle}>Login or signup to start your learning journey.</p>

          {!isFirebaseConfigured && (
            <p className={styles.demoNote}>Running in local demo mode. Add Firebase env vars for production auth.</p>
          )}

          <div className={styles.modeButtons}>
            <button type="button" onClick={() => setMode('login')} className={mode === 'login' ? styles.active : ''}>Login</button>
            <button type="button" onClick={() => setMode('signup')} className={mode === 'signup' ? styles.active : ''}>Signup</button>
          </div>

          <div className={styles.socialButtons}>
            <button type="button" className={styles.googleButton} onClick={handleGoogleLogin} disabled={!isFirebaseConfigured || googleBusy || busy || githubBusy}>
              <span className={styles.googleBadge}>G</span>
              <span>{googleBusy ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
            <button type="button" className={`${styles.googleButton} ${styles.githubButton}`} onClick={handleGitHubLogin} disabled={!isFirebaseConfigured || githubBusy || busy || googleBusy}>
              <GitFork size={16} />
              <span>{githubBusy ? 'Connecting...' : 'Continue with GitHub'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {mode === 'signup' && (
              <label>
                Name
                <input className="input" {...register('name')} />
                {errors.name && <small>{errors.name.message}</small>}
              </label>
            )}

            <label>
              Email
              <input className="input" {...register('email')} />
              {errors.email && <small>{errors.email.message}</small>}
            </label>

            <label>
              Password
              <input type="password" className="input" {...register('password')} />
              {errors.password && <small>{errors.password.message}</small>}
            </label>

            {mode === 'signup' && (
              <label>
                Skill level
                <select className="select" {...register('skillLevel')} defaultValue="Beginner">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </label>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <button className="button-primary" type="submit" disabled={busy}>
              {busy ? <LoadingSpinner label="Please wait" /> : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
