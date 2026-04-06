import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTransactions } from '../data/mockData';

export const useStore = create(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'Viewer',
      isDarkMode: false,
      
      globalSearch: '',
      setGlobalSearch: (term) => set({ globalSearch: term }),
      
      globalCategory: 'All',
      setGlobalCategory: (category) => set({ globalCategory: category }),

      dateFilterPreset: 'all',
      setDateFilterPreset: (preset) => set({ dateFilterPreset: preset }),

      deskNav: 'portfolio',
      setDeskNav: (nav) => set({ deskNav: nav }),

      layoutPreset: 'default',
      setLayoutPreset: (preset) => set({ layoutPreset: preset }),

      watchlist: [
        { symbol: 'NVDA', name: 'NVIDIA Corp.', changePct: 2.1 },
        { symbol: 'MSFT', name: 'Microsoft', changePct: -0.4 },
        { symbol: 'AAPL', name: 'Apple Inc.', changePct: 0.7 },
        { symbol: 'V', name: 'Visa Inc.', changePct: 0.2 },
      ],
      addWatchlistSymbol: (raw) =>
        set((state) => {
          const symbol = String(raw || '')
            .trim()
            .toUpperCase()
            .slice(0, 8);
          if (!symbol || state.watchlist.some((w) => w.symbol === symbol)) return state;
          return {
            watchlist: [
              ...state.watchlist,
              { symbol, name: `${symbol} · custom`, changePct: 0 },
            ],
          };
        }),
      removeWatchlistSymbol: (symbol) =>
        set((state) => ({
          watchlist: state.watchlist.filter((w) => w.symbol !== symbol),
        })),
      refreshWatchlistQuotes: () =>
        set((state) => ({
          watchlist: state.watchlist.map((w) => ({
            ...w,
            changePct: Math.round((Math.random() * 5 - 2.5) * 10) / 10,
          })),
        })),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { id: Date.now().toString(), ...transaction },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      restoreTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date)),
        })),

      setRole: (role) => set({ role }),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'finance-dashboard-v2',
    }
  )
);
