import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { interactiveRegistry } from './registry';

interface InteractiveEngineProps {
  subtopicId: string;
}

export default function InteractiveEngine({ subtopicId }: InteractiveEngineProps) {
  const ActiveInteractive = interactiveRegistry[subtopicId];

  return (
    <div className="w-full mb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={subtopicId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full min-h-[400px] border border-brand-accent/20 bg-black/40 rounded-[2.5rem] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 border-brand-border bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

          <Suspense fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-brand-accent">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Initializing Module...</span>
            </div>
          }>
            <div className="relative z-10 w-full h-full flex items-center justify-center min-h-[500px]">
              {ActiveInteractive ? (
                <ActiveInteractive />
              ) : (
                <div className="flex items-center justify-center h-64 bg-slate-900 border border-brand-border rounded-xl px-6">
                  <p className="text-slate-400 font-mono text-sm">Interactive module not found for ID: {subtopicId}</p>
                </div>
              )}
            </div>
          </Suspense>

          {/* Glowing Accents */}
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />
          <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
