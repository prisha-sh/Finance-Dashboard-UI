import { motion } from 'framer-motion';
import { LayoutGrid, LayoutTemplate, Minimize2, BarChart3 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { toast } from 'sonner';
import clsx from 'clsx';

const PRESETS = [
  {
    id: 'default',
    title: 'Balanced desk',
    description: 'Overview hero, summary cards, insights, D3 charts, Recharts, then transactions.',
    Icon: LayoutGrid,
  },
  {
    id: 'analytics',
    title: 'Analytics first',
    description: 'Radial and iso charts lead, then summaries and the ledger — for deep chart review.',
    Icon: BarChart3,
  },
  {
    id: 'minimal',
    title: 'Minimal',
    description: 'Hero plus balances and transactions only — hides extra insight and chart blocks.',
    Icon: Minimize2,
  },
];

export default function DeskLayouts() {
  const layoutPreset = useStore((s) => s.layoutPreset);
  const setLayoutPreset = useStore((s) => s.setLayoutPreset);
  const setDeskNav = useStore((s) => s.setDeskNav);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="section-kicker">Layouts</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Arrange your desk</h1>
        <p className="mt-3 max-w-2xl text-base font-medium text-[var(--text-secondary)]">
          Pick how Portfolio stacks its sections. Applying sends you back to Portfolio with the new order and
          visibility.
        </p>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRESETS.map(({ id, title, description, Icon }) => {
          const active = layoutPreset === id;
          return (
            <motion.button
              key={id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => {
                setLayoutPreset(id);
                setDeskNav('portfolio');
                toast.success(`Layout: ${title}`);
              }}
              className={clsx(
                'flex flex-col gap-4 rounded-[1.5rem] border p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg',
                active
                  ? 'border-[var(--accent-lime)] bg-[var(--accent-lime)]/10 shadow-[0_12px_40px_-20px_rgba(223,255,0,0.35)]'
                  : 'border-[var(--border-color)] bg-[var(--bg-panel)] hover:border-[var(--accent-lime)]/40'
              )}
            >
              <div
                className={clsx(
                  'flex h-12 w-12 items-center justify-center rounded-xl border',
                  active
                    ? 'border-[var(--ink)]/20 bg-[var(--accent-lime)] text-[var(--ink)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)]'
                )}
              >
                <Icon className="h-6 w-6 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[var(--text-primary)]">{title}</h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                  {description}
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent-lime)]">
                {active ? 'Active · click to re-apply' : 'Apply to Portfolio →'}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-10 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
        <LayoutTemplate className="h-4 w-4 text-[var(--accent-lime)]" />
        Current layout applies only to the Portfolio workspace.
      </p>
    </>
  );
}
