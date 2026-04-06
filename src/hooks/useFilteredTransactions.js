import { useMemo } from 'react';
import { parseISO, subDays } from 'date-fns';
import { useStore } from '../store/useStore';

const PRESET_DAYS = { '7d': 7, '30d': 30, '90d': 90 };

export function useFilteredTransactions() {
  const transactions = useStore((s) => s.transactions);
  const preset = useStore((s) => s.dateFilterPreset);

  return useMemo(() => {
    if (preset === 'all' || !PRESET_DAYS[preset]) return transactions;
    const days = PRESET_DAYS[preset];
    const cutoff = subDays(new Date(), days);
    return transactions.filter((t) => parseISO(t.date) >= cutoff);
  }, [transactions, preset]);
}
