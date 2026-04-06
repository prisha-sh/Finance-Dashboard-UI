import { motion } from 'framer-motion';
import SummaryCards from '../SummaryCards';
import TransactionsTable from '../TransactionsTable';

export default function DeskWallet() {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="section-kicker">Wallet</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Balances &amp; ledger</h1>
        <p className="mt-3 max-w-2xl text-base font-medium text-[var(--text-secondary)]">
          Cards and transaction history for the active period filter — same data as Portfolio, focused on cash
          positions and line items.
        </p>
      </motion.header>
      <SummaryCards />
      <div className="mt-2">
        <TransactionsTable />
      </div>
    </>
  );
}
