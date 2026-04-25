import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, UserCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const links = [
  { href: '/modules', label: 'Modules' },
  { href: '/playground', label: 'Playground' },
  { href: '/games', label: 'Games' },
  { href: '/quiz', label: 'Quizzes' },
  { href: '/tutor', label: 'AI Tutor' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.brand}>
          <BrainCircuit size={22} />
          <span>AIML Nexus</span>
        </Link>

        <nav className={styles.nav}>
          {links.map((link) => (
            <Link key={link.href} to={link.href} className={styles.navLink}>
              {location.pathname === link.href && <motion.span layoutId="nav-pill" className={styles.activePill} />}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.userZone}>
          <Link to="/dashboard" className={styles.profileBtn}>
            <UserCircle2 size={20} />
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
