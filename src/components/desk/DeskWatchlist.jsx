import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trash2, TrendingDown, TrendingUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';
import clsx from 'clsx';

export default function DeskWatchlist() {
  const watchlist = useStore((s) => s.watchlist);
  const addWatchlistSymbol = useStore((s) => s.addWatchlistSymbol);
  const removeWatchlistSymbol = useStore((s) => s.removeWatchlistSymbol);
  const refreshWatchlistQuotes = useStore((s) => s.refreshWatchlistQuotes);
  const [symbolInput, setSymbolInput] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const prevLen = watchlist.length;
    addWatchlistSymbol(symbolInput);
    if (useStore.getState().watchlist.length > prevLen) {
      toast.success(`Added ${symbolInput.trim().toUpperCase()} to watchlist`);
      setSymbolInput('');
    } else {
      toast.error('Enter a unique ticker (1–8 letters).');
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="section-kicker">Watchlist</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Symbols you track</h1>
        <p className="mt-3 max-w-2xl text-base font-medium text-[var(--text-secondary)]">
          Demo movers with mock day change — refresh simulates new quotes. Add tickers to persist them in this
          browser.
        </p>
      </motion.header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <form onSubmit={handleAdd} className="flex flex-1 flex-col gap-2 sm:max-w-xs">
          <label htmlFor="wl-symbol" className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Add symbol
          </label>
          <div className="flex gap-2">
            <input
              id="wl-symbol"
              value={symbolInput}
              onChange={(e) => setSymbolInput(e.target.value)}
              placeholder="e.g. JPM"
              maxLength={8}
              className="min-w-0 flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-2.5 text-sm font-bold uppercase text-[var(--text-primary)] placeholder:normal-case placeholder:font-medium placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-lime)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-lime)]/20"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-[var(--header-bar)] px-4 py-2.5 text-sm font-bold text-[var(--accent-lime)] transition-all hover:brightness-110"
            >
              Add
            </button>
          </div>
        </form>
        <button
          type="button"
          onClick={() => {
            refreshWatchlistQuotes();
            toast.success('Quotes refreshed (simulated)');
          }}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] transition-all hover:border-[var(--accent-lime)]/40"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh quotes
        </button>
      </div>

      <div className="glass-card overflow-hidden rounded-[2rem] border border-[var(--border-color)]">
        <div className="border-b border-[var(--border-color)] bg-[var(--bg-main)]/50 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            {watchlist.length} symbols
          </h2>
        </div>
        <ul className="divide-y divide-[var(--border-color)]">
          {watchlist.map((row) => (
            <li
              key={row.symbol}
              className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[var(--bg-main)]/40"
            >
              <div>
                <p className="text-lg font-black tracking-tight text-[var(--text-primary)]">{row.symbol}</p>
                <p className="text-sm font-medium text-[var(--text-secondary)]">{row.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={clsx(
                    'inline-flex items-center gap-1.5 text-sm font-black tabular-nums',
                    row.changePct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  )}
                >
                  {row.changePct >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {row.changePct >= 0 ? '+' : ''}
                  {row.changePct}%
                </span>
                <button
                  type="button"
                  onClick={() => {
                    removeWatchlistSymbol(row.symbol);
                    toast.message(`Removed ${row.symbol}`);
                  }}
                  className="rounded-xl border border-[var(--border-color)] p-2.5 text-[var(--text-secondary)] transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:border-rose-800 dark:hover:bg-rose-950/40"
                  aria-label={`Remove ${row.symbol}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
