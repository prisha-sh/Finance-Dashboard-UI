import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  X,
  Send,
  User,
  Maximize2,
  Minimize2,
  Paperclip,
  Image as ImageIcon,
  Mic,
} from 'lucide-react';
import { useFilteredTransactions } from '../hooks/useFilteredTransactions';
import { formatCurrency } from '../utils/helpers';
import { toast } from 'sonner';
import clsx from 'clsx';

function useChatLogic() {
  const transactions = useFilteredTransactions();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Zorvyn AI. Ask about spending, income, or savings for the period you've selected in the overview.",
      sender: 'ai',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const analyzeFinance = useCallback(
    (question) => {
      const expenses = transactions
        .filter((t) => t.type === 'Expense')
        .reduce((acc, t) => acc + Number(t.amount), 0);
      const income = transactions
        .filter((t) => t.type === 'Income')
        .reduce((acc, t) => acc + Number(t.amount), 0);

      const categoryTotals = transactions
        .filter((t) => t.type === 'Expense')
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
          return acc;
        }, {});

      const maxCat =
        Object.keys(categoryTotals).length > 0
          ? Object.keys(categoryTotals).reduce((a, b) =>
              categoryTotals[a] > categoryTotals[b] ? a : b
            )
          : 'Nothing';

      const q = question.toLowerCase();

      if (q.includes('spend') || q.includes('expense')) {
        return `In this period you've spent ${formatCurrency(expenses)}. Highest category: ${maxCat}.`;
      }
      if (q.includes('income') || q.includes('earn')) {
        return `Income in this period: ${formatCurrency(income)}.`;
      }
      if (q.includes('save') || q.includes('health') || q.includes('doing')) {
        if (income > expenses) {
          return `You're in the green: about ${formatCurrency(income - expenses)} ahead for this period.`;
        }
        return `You're spending ${formatCurrency(expenses - income)} more than income in this window — worth a budget pass.`;
      }
      if (q.includes('summary') || q.includes('overview')) {
        return `Period snapshot — Income ${formatCurrency(income)}, Expenses ${formatCurrency(expenses)}, Net ${formatCurrency(income - expenses)}.`;
      }

      return "Try: “What are my expenses?”, “How much did I earn?”, “How am I doing?”, or “Give me a summary.”";
    },
    [transactions]
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = analyzeFinance(userMsg.text);
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
      setIsTyping(false);
    }, 900);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return { messages, input, setInput, isTyping, handleSend, messagesEndRef };
}

function ChatHeader({ onClose, onToggleExpand, expanded, showClose, showExpand }) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-color)] bg-[var(--header-bar)] px-4 py-3 text-white">
      <div className="flex min-w-0 items-center gap-2">
        <div className="shrink-0 rounded-full bg-[var(--accent-lime)] p-1.5 text-[var(--ink)]">
          <Bot className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">AI Assistant</h3>
          <p className="truncate text-[10px] font-medium text-white/60">Zorvyn · period-aware</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {showExpand && (
          <button
            type="button"
            onClick={() => {
              onToggleExpand();
              toast.info(expanded ? 'Assistant docked to sidebar' : 'Assistant expanded');
            }}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={expanded ? 'Restore sidebar' : 'Expand assistant'}
          >
            {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        )}
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function ChatMessages({ messages, isTyping, messagesEndRef }) {
  return (
    <div className="hide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto bg-[var(--bg-card)]/40 px-4 py-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={clsx('flex items-end gap-2', msg.sender === 'user' && 'flex-row-reverse')}
        >
          <div
            className={clsx(
              'shrink-0 rounded-full p-1.5',
              msg.sender === 'user'
                ? 'bg-[var(--accent-lime)] text-[var(--ink)]'
                : 'bg-[var(--header-bar)] text-[var(--accent-lime)]'
            )}
          >
            {msg.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
          </div>
          <div
            className={clsx(
              'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm',
              msg.sender === 'user'
                ? 'rounded-br-sm bg-[var(--header-bar)] text-white'
                : 'rounded-bl-sm border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-primary)]'
            )}
          >
            {msg.text}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex items-end gap-2">
          <div className="shrink-0 rounded-full bg-[var(--header-bar)] p-1.5 text-[var(--accent-lime)]">
            <Bot className="h-3 w-3" />
          </div>
          <div className="flex max-w-[80%] items-center gap-1 rounded-2xl rounded-bl-sm border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 shadow-sm">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent-lime)]"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent-lime)]"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              className="h-1.5 w-1.5 rounded-full bg-[var(--accent-lime)]"
            />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function ChatComposer({ input, setInput, onSubmit }) {
  return (
    <div className="shrink-0 border-t border-[var(--border-color)] bg-[var(--bg-panel)] p-3">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() =>
            toast.message('Attach files', { description: 'Demo action — wire your upload API here.' })
          }
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-lime)]/50 hover:text-[var(--text-primary)]"
        >
          <Paperclip className="h-3 w-3" />
          Files
        </button>
        <button
          type="button"
          onClick={() => toast.message('Images', { description: 'Demo — image context for the assistant.' })}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-lime)]/50 hover:text-[var(--text-primary)]"
        >
          <ImageIcon className="h-3 w-3" />
          Images
        </button>
        <button
          type="button"
          onClick={() => toast.message('Audio', { description: 'Demo — voice notes placeholder.' })}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-lime)]/50 hover:text-[var(--text-primary)]"
        >
          <Mic className="h-3 w-3" />
          Audio
        </button>
      </div>
      <form onSubmit={onSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your AI Assistant request…"
          className="w-full rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] py-3 pl-4 pr-24 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--accent-lime)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-lime)]/25"
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <button
            type="button"
            className="rounded-full p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"
            aria-label="Add"
            onClick={() => toast.message('Quick actions', { description: 'Demo — open command palette.' })}
          >
            <span className="text-lg font-light leading-none">+</span>
          </button>
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-full bg-[var(--header-bar)] p-2 text-[var(--accent-lime)] transition-all hover:brightness-110 disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AiChat() {
  const chat = useChatLogic();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const dockShell = expanded
    ? 'fixed inset-4 z-[100] flex flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)] shadow-2xl sm:inset-8 lg:inset-12'
    : 'flex h-full min-h-0 w-full flex-col overflow-hidden border-l border-[var(--border-color)] bg-[var(--bg-main)]';

  return (
    <>
      {/* Desktop: fixed-height column; only message list scrolls */}
      <aside
        className={clsx(
          'hidden min-h-0 shrink-0 transition-[width,min-width] duration-200 lg:flex',
          expanded ? 'w-0 min-w-0 overflow-visible border-0' : 'w-[min(420px,32vw)]'
        )}
        aria-label="AI Assistant"
      >
        <div className={dockShell}>
          <ChatHeader
            showClose={false}
            showExpand
            expanded={expanded}
            onToggleExpand={() => setExpanded((e) => !e)}
          />
          <ChatMessages
            messages={chat.messages}
            isTyping={chat.isTyping}
            messagesEndRef={chat.messagesEndRef}
          />
          <ChatComposer
            input={chat.input}
            setInput={chat.setInput}
            onSubmit={chat.handleSend}
          />
        </div>
      </aside>

      {/* Mobile: floating launcher + sheet (same chat state) */}
      <div className="lg:hidden">
        <AnimatePresence>
          {!mobileOpen && (
            <motion.button
              type="button"
              onClick={() => setMobileOpen(true)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full border-2 border-[var(--accent-lime)] bg-[var(--header-bar)] p-3.5 text-[var(--accent-lime)] shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all hover:brightness-110"
              aria-label="Open AI Assistant"
            >
              <Sparkles className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              className="fixed bottom-6 right-6 z-50 flex max-h-[min(72vh,540px)] w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/95 shadow-2xl backdrop-blur-xl"
            >
              <ChatHeader
                showClose
                showExpand={false}
                expanded={false}
                onClose={() => setMobileOpen(false)}
                onToggleExpand={() => {}}
              />
              <ChatMessages
                messages={chat.messages}
                isTyping={chat.isTyping}
                messagesEndRef={chat.messagesEndRef}
              />
              <ChatComposer
                input={chat.input}
                setInput={chat.setInput}
                onSubmit={chat.handleSend}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
