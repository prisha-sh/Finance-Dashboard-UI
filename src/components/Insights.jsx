import React from 'react';
import { useStore } from '../store/useStore';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { motion } from 'framer-motion';

export default function Insights() {
  const transactions = useStore((state) => state.transactions);

  const insights = React.useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter((t) => t.type === 'Expense');
    
    
    const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    
    
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
      return acc;
    }, {});

    
    let highestCategory = '';
    let maxAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > maxAmount) {
        maxAmount = amount;
        highestCategory = cat;
      }
    });
    
    const highestPercentage = totalExpenses > 0 ? Math.round((maxAmount / totalExpenses) * 100) : 0;

    
    const categoryCounts = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});
    
    let frequentCategory = '';
    let maxCount = 0;
    Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > maxCount) {
        maxCount = count;
        frequentCategory = cat;
      }
    });

    return {
      totalExpenses,
      highestCategory: highestCategory || 'N/A',
      maxAmount,
      highestPercentage,
      frequentCategory: frequentCategory || 'N/A'
    };
  }, [transactions]);

  const setGlobalCategory = useStore((state) => state.setGlobalCategory);

  if (!insights) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-8 mb-8"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="glass-card flex flex-col gap-4 rounded-[1.5rem] p-6 transition-all hover:-translate-y-1 hover:shadow-xl duration-300 border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-3.5 shadow-lg shadow-orange-500/30">
              <TrendingDown className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Total Expenses</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[var(--text-primary)]">{formatCurrency(insights.totalExpenses)}</p>
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-1.5 flex items-center gap-1">
              Across all categories
            </p>
          </div>
        </div>

        <button 
          onClick={() => setGlobalCategory(insights.highestCategory)}
          className="text-left glass-card flex flex-col gap-4 rounded-[1.5rem] p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.3)] duration-300 border border-[var(--border-color)] hover:border-rose-500/50 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-rose-400 to-red-600 p-3.5 shadow-lg shadow-red-500/30">
              <Target className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Highest Category</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[var(--text-primary)] truncate max-w-[180px] group-hover:text-rose-500 transition-colors">
              {insights.highestCategory}
            </p>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1.5 flex items-center gap-1">
              <span className="text-rose-600 dark:text-rose-400 font-bold">{insights.highestPercentage}%</span> of total expenses
            </p>
          </div>
        </button>

        <button 
          onClick={() => setGlobalCategory(insights.frequentCategory)}
          className="text-left glass-card flex flex-col gap-4 rounded-[1.5rem] p-6 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)] duration-300 border border-[var(--border-color)] hover:border-blue-500/50 cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-3.5 shadow-lg shadow-blue-500/30">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Most Frequent</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[var(--text-primary)] truncate max-w-[180px] group-hover:text-blue-500 transition-colors">
              {insights.frequentCategory}
            </p>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1.5 flex items-center gap-1">
              Used the most often
            </p>
          </div>
        </button>

        <div className="glass-card flex flex-col gap-4 rounded-[1.5rem] p-6 transition-all hover:-translate-y-1 hover:shadow-xl duration-300 border border-[var(--border-color)]">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-3.5 shadow-lg shadow-teal-500/30">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Avg. Transaction</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[var(--text-primary)]">
              {insights.totalExpenses > 0 ? formatCurrency(insights.totalExpenses / transactions.filter(t=>t.type==='Expense').length) : '$0.00'}
            </p>
            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1.5">
              Across all expenses
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
