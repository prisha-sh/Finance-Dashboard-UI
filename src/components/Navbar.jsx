import React from 'react';
import { useStore } from '../store/useStore';
import { Moon, Sun, WalletCards, Shield, ShieldAlert, Hexagon, Zap } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { role, setRole, isDarkMode, toggleDarkMode } = useStore();

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="sticky top-0 z-50 flex h-20 w-full items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-main)]/60 backdrop-blur-xl px-6 lg:px-12 shadow-sm"
    >
      <div className="flex items-center gap-4 group cursor-pointer lg:hover:scale-105 transition-transform duration-300">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-500 to-purple-600 text-white shadow-[0_8px_20px_rgba(99,102,241,0.4)] overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_280deg,rgba(255,255,255,0.8)_360deg)] opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0.5 bg-gradient-to-br from-brand-600 to-indigo-800 rounded-[14px] z-0" />
          <Hexagon className="h-10 w-10 absolute opacity-20 rotate-90 scale-125 z-0" />
          <Zap className="h-6 w-6 relative z-10 group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
        <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-[var(--text-primary)] via-[var(--text-primary)] to-brand-500 bg-clip-text text-transparent drop-shadow-sm flex items-end">
          FinDash<span className="text-brand-500 text-4xl leading-[0.6] ml-0.5">.</span>
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {}
        <div className="flex items-center rounded-2xl bg-[var(--bg-card)] p-1 border border-[var(--border-color)] shadow-inner">
          <button
            onClick={() => setRole('Viewer')}
            className={clsx(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300',
              role === 'Viewer'
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 translate-y-0.5'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Viewer</span>
          </button>
          <button
            onClick={() => setRole('Admin')}
            className={clsx(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300',
              role === 'Admin'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            <ShieldAlert className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {}
        <div className="h-8 w-px bg-[var(--border-color)]"></div>

        {}
        <button
          onClick={toggleDarkMode}
          className="group rounded-full p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-main)] hover:text-amber-500 dark:hover:text-amber-400 shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5 group-hover:text-indigo-500" />}
        </button>
      </div>
    </motion.nav>
  );
}
