import React, { useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import ChartsSection from '../components/ChartsSection';
import Insights from '../components/Insights';
import TransactionsTable from '../components/TransactionsTable';
import AiChat from '../components/AiChat';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { calculateTotals, formatCurrency } from '../utils/helpers';

export default function Dashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const transactions = useStore((state) => state.transactions);

  const { balance } = useMemo(() => calculateTotals(transactions), [transactions]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  
  useEffect(() => {
    document.title = `FinDash`;
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] font-sans antialiased text-[var(--text-primary)] transition-colors duration-500">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 flex flex-col items-start lg:flex-row lg:items-end justify-between"
        >
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-5xl">
              Dashboard Overview
            </h1>
            <p className="mt-3 text-lg text-[var(--text-secondary)] font-medium max-w-2xl">
              Here's your comprehensive financial summary. Monitor your balances, track expenses, and grow your wealth.
            </p>
          </div>
          <div className="mt-6 lg:mt-0 right-0">
            <span className="inline-flex rounded-full bg-brand-500/10 px-4 py-2 text-sm font-bold tracking-tight text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Live Data Sync • Up to date
            </span>
          </div>
        </motion.div>

        <SummaryCards />
        <Insights />
        <ChartsSection />
        <TransactionsTable />
        <AiChat />
        
        <footer className="mt-12 mb-8 text-center text-sm font-medium text-[var(--text-secondary)]">
          <p>
            Curated and Developed by{' '}
            <a 
              href="https://www.linkedin.com/in/prisha-sharma333/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-extrabold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors underline decoration-transparent hover:decoration-brand-500 underline-offset-4"
            >
              Prisha :)
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
