import React, { useState } from 'react';
import DashboardBackdrop from '../webgl/DashboardBackdrop';
import { useStore } from '../../store/useStore';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';

const PERIOD_OPTIONS = [
  { id: 'all', label: 'All time' },
  { id: '90d', label: '90 days' },
  { id: '30d', label: '30 days' },
  { id: '7d', label: '7 days' },
];

const PARTNERS = ['All partners', 'Retail desk', 'Institutional', 'Internal'];

export default function OverviewHero() {
  const dateFilterPreset = useStore((state) => state.dateFilterPreset);
  const setDateFilterPreset = useStore((state) => state.setDateFilterPreset);
  const [partner, setPartner] = useState(PARTNERS[0]);

  return (
    <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-panel)]/80 shadow-[var(--card-glow)]">
      <DashboardBackdrop className="opacity-[0.85] dark:opacity-60" />
      <div className="relative z-10 grid gap-8 p-8 lg:grid-cols-[1fr_min(340px,42%)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <p className="section-kicker">Overview panel</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Command your cash flow</h1>
          <p className="mt-3 max-w-xl text-base font-medium text-[var(--text-secondary)]">
            Glass, lime, and live charts — pick a period and partner lens; the assistant on the right stays
            pinned while you scroll the desk.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Period
            </span>
            <div className="flex flex-wrap gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)]/60 p-1 backdrop-blur-md">
              {PERIOD_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setDateFilterPreset(id);
                    toast.success(`Dashboard scoped to ${label.toLowerCase()}`);
                  }}
                  className={clsx(
                    'rounded-full px-3 py-1.5 text-xs font-bold transition-all',
                    dateFilterPreset === id
                      ? 'bg-[var(--header-bar)] text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
              <span className="text-[10px] uppercase tracking-[0.2em]">Partner</span>
              <span className="relative inline-flex items-center">
                <select
                  value={partner}
                  onChange={(e) => {
                    setPartner(e.target.value);
                    toast.message('Partner lens', {
                      description: `${e.target.value} — demo filter; wire to your data source.`,
                    });
                  }}
                  className="appearance-none rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] py-2 pl-4 pr-10 text-xs font-bold text-[var(--text-primary)] focus:border-[var(--accent-lime)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-lime)]/20"
                >
                  {PARTNERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--text-secondary)]" />
              </span>
            </label>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative isolate flex min-h-[200px] items-center justify-center lg:min-h-[260px]"
        >
          <div
            className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-[var(--accent-lime)]/25 via-white/10 to-transparent blur-2xl dark:from-[var(--accent-lime)]/15"
            aria-hidden
          />
          <div className="relative w-full max-w-sm space-y-3 [perspective:1200px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl border border-white/20 p-5 shadow-lg backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1"
                style={{
                  transform: `translateY(${i * 10}px) translateZ(${-i * 40}px) rotateX(6deg)`,
                  opacity: 1 - i * 0.12,
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
                  {i === 0 ? 'Account insights' : i === 1 ? 'Automation' : 'Signals'}
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                  {i === 0 && 'Last period, categorization and rules recovered noticeable review time.'}
                  {i === 1 && 'Sync health and anomaly cards update as you change the date range.'}
                  {i === 2 && 'WebGL accents stay lightweight — drag-free, pointer-events off.'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
