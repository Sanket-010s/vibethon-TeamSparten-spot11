"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { BrainCircuit, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./Navbar.module.css";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/modules", label: "Modules" },
  { href: "/playground", label: "Playground" },
  { href: "/games", label: "Games" },
  { href: "/quiz", label: "Quizzes" },
  { href: "/tutor", label: "AI Tutor" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/dashboard" className={styles.brand} aria-label="AIML Nexus home">
          <BrainCircuit size={19} />
          <span>AIML Nexus</span>
        </Link>

        <nav aria-label="Primary navigation" className={styles.nav}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {pathname === link.href && <motion.span layoutId="nav-pill" className={styles.activePill} />}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.userZone}>
          <span className={styles.userText}>{user?.displayName || user?.email || "Guest"}</span>
          <button type="button" className="button-danger" onClick={logout} aria-label="Logout">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
