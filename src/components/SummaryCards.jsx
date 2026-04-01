import React, { useMemo, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { calculateTotals, formatCurrency } from '../utils/helpers';
import { ArrowUpRight, ArrowDownRight, Wallet, Flame } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};


const AnimatedNumber = ({ value }) => {
  const nodeRef = useRef(null);
  
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = formatCurrency(latest);
        }
      }
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={nodeRef}>{formatCurrency(0)}</span>;
};


const InteractiveBalanceCard = ({ balance }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="relative [perspective:1000px] h-[220px] w-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 text-white shadow-2xl border border-slate-700/50 cursor-crosshair group z-10"
      >
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ transform: "translateZ(1px)" }} />
        
        <div className="absolute inset-0 opacity-10 pointer-events-none rounded-[2rem] overflow-hidden" style={{ transform: "translateZ(0px)" }}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="relative h-full flex flex-col justify-between" style={{ transform: "translateZ(40px)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Total Balance</p>
              <h3 className="mt-2 text-4xl font-extrabold tracking-tight drop-shadow-lg text-white">
                <AnimatedNumber value={balance} />
              </h3>
            </div>
            <div className="rounded-full bg-white/10 p-3 backdrop-blur-md border border-white/20">
              <Wallet className="h-6 w-6 text-brand-300" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm font-semibold tracking-widest text-slate-300">
            <span>**** **** **** 4242</span>
            <div className="flex items-center gap-2">
              <div className="h-5 w-8 rounded bg-gradient-to-r from-brand-500 to-blue-500 opacity-80" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function SummaryCards() {
  const transactions = useStore((state) => state.transactions);

  const { income, expense, balance } = useMemo(
    () => calculateTotals(transactions),
    [transactions]
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } }
      }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      <InteractiveBalanceCard balance={balance} />

      {}
      <motion.div variants={itemVariants} className="glass-card rounded-[2rem] p-8 h-[220px] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] transition-all duration-300 border border-[var(--border-color)] hover:border-emerald-500/30 flex flex-col justify-between z-0">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
          <ArrowUpRight className="w-32 h-32 text-emerald-500" />
        </div>
        <div className="flex items-start justify-between relative z-10 w-full mb-auto">
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)]">Total Income</p>
            <h3 className="mt-3 text-4xl font-extrabold text-[var(--text-primary)] tracking-tight drop-shadow-sm">
              <AnimatedNumber value={income} />
            </h3>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 p-4 shadow-inner ring-1 ring-emerald-500/20">
            <ArrowUpRight className="h-7 w-7 text-emerald-500" />
          </div>
        </div>
        <div>
           <div className="flex items-end gap-1 h-8 mt-4 opacity-30 group-hover:opacity-80 transition-opacity">
              {[4,7,5,9,8,12,10].map((h, i) => (
                <div key={i} className="w-4 bg-emerald-500 rounded-t-sm" style={{ height: `${h * 4}px` }} />
              ))}
           </div>
        </div>
      </motion.div>

      {}
      <motion.div variants={itemVariants} className="glass-card rounded-[2rem] p-8 h-[220px] relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.2)] dark:hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.1)] transition-all duration-300 border border-[var(--border-color)] hover:border-rose-500/30 sm:col-span-2 lg:col-span-1 flex flex-col justify-between z-0">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
          <ArrowDownRight className="w-32 h-32 text-rose-500" />
        </div>
        <div className="flex items-start justify-between relative z-10 w-full mb-auto">
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)]">Total Expenses</p>
            <h3 className="mt-3 text-4xl font-extrabold text-[var(--text-primary)] tracking-tight drop-shadow-sm">
              <AnimatedNumber value={expense} />
            </h3>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-rose-400/20 to-rose-600/20 p-4 shadow-inner ring-1 ring-rose-500/20">
            <ArrowDownRight className="h-7 w-7 text-rose-500" />
          </div>
        </div>
        <div>
           <div className="flex items-center gap-2 mt-4 text-xs font-bold text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer">
             <motion.div
               animate={{ rotate: [-10, 10, -10], scale: [1, 1.2, 1], y: [0, -2, 0] }}
               transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
             >
               <Flame className="w-4 h-4 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.8)] fill-transparent group-hover:fill-orange-400 transition-all duration-300" />
             </motion.div>
             <span>Burning {expense > 0 ? 'too fast' : 'at healthy rate'}</span>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
