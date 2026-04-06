import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, RotateCcw } from 'lucide-react';
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions';
import { formatCurrency, formatDate, getCategoryIcon } from '../../utils/helpers';
import clsx from 'clsx';
import { toast } from 'sonner';

export default function DeskScreeners() {
  const transactions = useFilteredTransactions();
  const [type, setType] = useState('All');
  const [category, setCategory] = useState('All');
  const [minAmount, setMinAmount] = useState('');

  const categories = useMemo(() => {
    const s = new Set(transactions.map((t) => t.category));
    return ['All', ...Array.from(s).sort()];
  }, [transactions]);

  const results = useMemo(() => {
    const min = minAmount === '' ? 0 : Number(minAmount);
    return transactions.filter((t) => {
      if (type !== 'All' && t.type !== type) return false;
      if (category !== 'All' && t.category !== category) return false;
      if (Number.isFinite(min) && min > 0 && Number(t.amount) < min) return false;
      return true;
    });
  }, [transactions, type, category, minAmount]);

  const reset = () => {
    setType('All');
    setCategory('All');
    setMinAmount('');
    toast.message('Screener reset');
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="section-kicker">Screeners</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Filter the ledger</h1>
        <p className="mt-3 max-w-2xl text-base font-medium text-[var(--text-secondary)]">
          Slice transactions from the current period filter by type, category, and minimum amount. Does not
          change global table filters — this view is isolated.
        </p>
      </motion.header>

      <div className="mb-8 glass-card rounded-[2rem] border border-[var(--border-color)] p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[var(--text-primary)]">
            <Filter className="h-5 w-5 text-[var(--accent-lime)]" />
            <h2 className="text-lg font-black">Criteria</h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Type
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-3 text-sm font-bold text-[var(--text-primary)] focus:border-[var(--accent-lime)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-lime)]/20"
            >
              {['All', 'Income', 'Expense'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-3 text-sm font-bold text-[var(--text-primary)] focus:border-[var(--accent-lime)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-lime)]/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
              Min amount ($)
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0"
              className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-panel)] px-4 py-3 text-sm font-bold text-[var(--text-primary)] placeholder:font-medium placeholder:text-[var(--text-secondary)] focus:border-[var(--accent-lime)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-lime)]/20"
            />
          </label>
        </div>
      </div>

      <div className="glass-card overflow-hidden rounded-[2rem] border border-[var(--border-color)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] bg-[var(--bg-main)]/50 px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            Matches
          </h2>
          <span className="rounded-full bg-[var(--header-bar)] px-3 py-1 text-xs font-black text-[var(--accent-lime)]">
            {results.length} rows
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--border-color)] bg-[var(--bg-main)]/30">
              <tr>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Title
                </th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-sm font-medium text-[var(--text-secondary)]">
                    No rows match. Loosen filters or change the period in the Portfolio overview.
                  </td>
                </tr>
              ) : (
                results.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-main)]/40"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-bold text-[var(--text-secondary)]">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--text-primary)]">{t.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] px-2.5 py-1 text-xs font-bold text-[var(--text-secondary)]">
                        <span>{getCategoryIcon(t.category)}</span> {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={clsx(
                          'rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest',
                          t.type === 'Income'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                        )}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={clsx(
                        'px-6 py-4 text-right text-base font-extrabold tabular-nums',
                        t.type === 'Income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-[var(--text-primary)]'
                      )}
                    >
                      {t.type === 'Income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
