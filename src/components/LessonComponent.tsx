/**
 * LessonComponent.tsx
 *
 * Enhanced:
 * - Floating Socratic AI Tutor chat panel (calls socraticTutor from aiService)
 * - Exam board tags (WAEC · Cambridge · IB · NGSS) on each lesson
 * - Estimated reading time
 * - Section progress tracking
 * - RevealBox and ExpandBox retain original feel with polish
 * - Clean import path for aiService (now at project root)
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Eye, MessageCircle, Send, X, Loader2, BookOpen, Clock } from 'lucide-react';
import { LessonSection } from '../data/mockData';
import InteractiveEngine from './interactives/InteractiveEngine';
import { socraticTutor, SocraticResponse } from '../services/aiService';

// ─── Types ───────────────────────────────────────────────────────────────────

interface LessonComponentProps {
  sections: LessonSection[];
  subtopicId?: string;
  subject?: string;
  examBoards?: ('WAEC' | 'Cambridge' | 'IB' | 'NGSS')[];
}

interface ChatMessage {
  role: 'student' | 'tutor';
  content: string;
  followUp?: string;
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function LessonComponent({
  sections,
  subtopicId,
  subject = 'Science',
  examBoards = ['WAEC', 'Cambridge', 'IB'],
}: LessonComponentProps) {
  const [tutorOpen, setTutorOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Estimate reading time (≈ 200 wpm)
  const wordCount = sections.reduce((n, s) => n + s.content.split(' ').length, 0);
  const readMinutes = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const sendToTutor = async () => {
    if (!userInput.trim() || isSending) return;
    const msg = userInput.trim();
    setUserInput('');
    setChatHistory(prev => [...prev, { role: 'student', content: msg }]);
    setIsSending(true);
    try {
      const res: SocraticResponse = await socraticTutor(
        msg,
        subtopicId ?? 'this lesson',
        subject,
        chatHistory,
      );
      setChatHistory(prev => [
        ...prev,
        { role: 'tutor', content: res.response, followUp: res.follow_up_question },
      ]);
    } catch {
      setChatHistory(prev => [
        ...prev,
        { role: 'tutor', content: "I'm having trouble connecting right now. Try reviewing your notes and I'll be back soon!" },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 max-w-4xl mx-auto relative">

      {/* Exam board tags + reading time */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {examBoards.map(board => (
            <span
              key={board}
              className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-brand-accent/10 border border-brand-accent/20 text-brand-accent"
            >
              {board}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <Clock size={11} />
          ~{readMinutes} min read
        </div>
      </div>

      {/* Interactive module */}
      {subtopicId && <InteractiveEngine subtopicId={subtopicId} />}

      {/* Lesson sections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        {sections.map((section, idx) => (
          <motion.section
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-slate-900/40 rounded-3xl p-7 border border-brand-border relative overflow-hidden"
          >
            {/* Left accent bar */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-accent/60 to-transparent" />

            {/* Section number badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-[10px] font-black text-brand-accent">
                {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">{section.title}</h3>
            </div>

            <p className="text-slate-400 leading-relaxed text-base mb-5">
              {section.content}
            </p>

            {section.interactive && (
              <div className="mt-2">
                {section.interactive.type === 'reveal' ? (
                  <RevealBox
                    label={section.interactive.label}
                    content={section.interactive.hiddenContent}
                  />
                ) : (
                  <ExpandBox
                    label={section.interactive.label}
                    content={section.interactive.hiddenContent}
                  />
                )}
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {/* ── Socratic AI Tutor floating button ──────────────────────────────── */}
      <motion.button
        onClick={() => setTutorOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-brand-accent text-black rounded-2xl font-bold text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:bg-white transition-colors"
      >
        <MessageCircle size={16} />
        Ask AI Tutor
      </motion.button>

      {/* ── AI Tutor Chat Panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {tutorOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTutorOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-slate-950 border-l border-brand-border z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center">
                    <BookOpen size={16} className="text-brand-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Socratic Tutor</div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest">
                      {subtopicId ?? 'This Lesson'} · {subject}
                    </div>
                  </div>
                </div>
                <button onClick={() => setTutorOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 && (
                  <div className="text-center py-10">
                    <div className="text-3xl mb-3">🎓</div>
                    <p className="text-slate-400 text-sm">
                      Ask me anything about this lesson. I'll guide you with questions rather than just giving answers — that's how deep learning happens!
                    </p>
                    <div className="mt-4 space-y-2">
                      {[
                        'Why does osmosis happen?',
                        'Explain the difference between active and passive transport.',
                        'What would happen if there were no cell wall?',
                      ].map(q => (
                        <button
                          key={q}
                          onClick={() => { setUserInput(q); }}
                          className="block w-full text-left px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 hover:border-brand-accent/40 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'student'
                        ? 'bg-brand-accent/20 border border-brand-accent/30 text-white'
                        : 'bg-slate-900 border border-slate-800 text-slate-300'
                      }`}>
                      {msg.content}
                      {msg.followUp && (
                        <div className="mt-2 pt-2 border-t border-slate-700/50 text-brand-accent text-xs italic">
                          💭 {msg.followUp}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-brand-accent" />
                      <span className="text-xs text-slate-500">Thinking…</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendToTutor()}
                    placeholder="Ask a question…"
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 focus:border-brand-accent focus:outline-none"
                  />
                  <button
                    onClick={sendToTutor}
                    disabled={!userInput.trim() || isSending}
                    className="p-3 bg-brand-accent text-black rounded-xl hover:bg-white disabled:opacity-40 transition-all"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-[9px] text-slate-600 mt-2 text-center">
                  AI tutor when available · Guides thinking, not shortcuts
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function RevealBox({ label, content }: { label: string; content: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      onClick={() => setRevealed(r => !r)}
      className="group cursor-pointer bg-black/40 border border-brand-border rounded-2xl p-5 transition-all hover:bg-slate-900/60"
    >
      <div className="flex items-center gap-2 text-[10px] font-bold text-brand-accent mb-3 uppercase tracking-widest">
        <Eye size={13} />
        {label}
      </div>
      <div className={`transition-all duration-500 ${revealed ? 'opacity-100 blur-none' : 'opacity-20 blur-md select-none'}`}>
        <p className="text-white font-medium italic leading-relaxed text-sm">{content}</p>
      </div>
      {!revealed && (
        <div className="mt-3 text-[10px] text-brand-accent font-black uppercase tracking-[0.2em] animate-pulse">
          Click to reveal
        </div>
      )}
    </div>
  );
}

function ExpandBox({ label, content }: { label: string; content: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-brand-border rounded-2xl overflow-hidden bg-black/20">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-900/40 transition-colors text-left"
      >
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</span>
        <ChevronDown
          size={16}
          className={`text-brand-accent transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-5 text-slate-400 text-sm leading-relaxed border-t border-brand-border/50">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
