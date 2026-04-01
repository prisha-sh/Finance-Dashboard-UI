import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, X, Send, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../utils/helpers';

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Zorvyn AI. Ask me to analyze your spending!", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const transactions = useStore((state) => state.transactions);

  
  const analyzeFinance = (question) => {
    const expenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + Number(t.amount), 0);
    const income = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + Number(t.amount), 0);
    
    
    const categoryTotals = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});
    
    const maxCat = Object.keys(categoryTotals).length > 0 
      ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b)
      : 'Nothing';
      
    const q = question.toLowerCase();

    if (q.includes('spend') || q.includes('expense')) {
      return `You've spent a total of ${formatCurrency(expenses)}. Your highest spending area is ${maxCat}. Try to cut back there!`;
    }
    if (q.includes('income') || q.includes('earn')) {
      return `You've earned ${formatCurrency(income)} so far. Outstanding!`;
    }
    if (q.includes('save') || q.includes('health') || q.includes('doing')) {
      if (income > expenses) {
        return `You're in the green! You've saved ${formatCurrency(income - expenses)}. Keep it up! 🚀`;
      } else {
        return `Watch out! You're currently spending ${formatCurrency(expenses - income)} more than you make. Consider reducing budgets.`;
      }
    }
    
    return "I'm still learning! Try asking me 'how am I doing?', 'what are my expenses?', or 'how much did I earn?'.";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    
    setTimeout(() => {
      const response = analyzeFinance(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'ai' }]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <>
      {}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 p-3 text-white shadow-[0_4px_15px_rgba(124,58,237,0.4)] hover:shadow-[0_4px_25px_rgba(124,58,237,0.6)] transition-all"
          >
            <Sparkles className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-main)]/90 backdrop-blur-2xl shadow-2xl flex flex-col"
          >
            {}
            <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-gradient-to-r from-violet-600/10 to-indigo-600/10 p-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-violet-600 p-1.5 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[var(--text-primary)] text-sm">Zorvyn Copilot</h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-medium text-violet-500">AI Financial Analyst</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {}
            <div className="flex flex-col gap-3 p-4 h-[300px] overflow-y-auto hide-scrollbar bg-[var(--bg-card)]/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`shrink-0 rounded-full p-1.5 ${msg.sender === 'user' ? 'bg-brand-500' : 'bg-violet-600'} text-white`}>
                    {msg.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-500 text-white rounded-br-sm'
                        : 'bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="shrink-0 rounded-full bg-violet-600 p-1.5 text-white">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {}
            <form onSubmit={handleSend} className="p-3 border-t border-[var(--border-color)] bg-[var(--bg-card)]">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Zorvyn..."
                  className="w-full rounded-full border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2.5 pr-10 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-1.5 top-1.5 rounded-full bg-violet-600 p-1.5 text-white transition-all hover:bg-violet-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
