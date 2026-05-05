import { motion, AnimatePresence } from 'motion/react';
import { useState, ReactNode } from 'react';
import { X, ChevronRight, BookOpen, Target } from 'lucide-react';

interface DetailItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

interface DetailSection {
  title: string;
  content: string;
  items?: DetailItem[];
}

interface DetailDrawerProps {
  title: string;
  subtitle?: string;
  image?: string;
  sections: DetailSection[];
  isOpen: boolean;
  onClose: () => void;
  actions?: { label: string; onClick: () => void; icon?: ReactNode }[];
}

export default function DetailDrawer({
  title,
  subtitle,
  image,
  sections,
  isOpen,
  onClose,
  actions,
}: DetailDrawerProps) {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-slate-900 border-l border-slate-800 z-50 overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  {subtitle && (
                    <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {image && (
                <div className="p-6 border-b border-slate-800">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {sections.map((section, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <button
                        onClick={() => setActiveSection(activeSection === idx ? -1 : idx)}
                        className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen size={18} className="text-brand-accent" />
                          <span className="font-medium text-white">{section.title}</span>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`text-slate-500 transition-transform ${
                            activeSection === idx ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeSection === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 space-y-4">
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {section.content}
                              </p>

                              {section.items && section.items.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                  {section.items.map((item, itemIdx) => (
                                    <div
                                      key={itemIdx}
                                      className="bg-slate-900/50 rounded-lg p-3"
                                    >
                                      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                                        {item.icon && <span className="mr-1">{item.icon}</span>}
                                        {item.label}
                                      </div>
                                      <div className="text-white font-mono font-bold">
                                        {item.value}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {actions && actions.length > 0 && (
                <div className="p-6 border-t border-slate-800 space-y-3">
                  {actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={action.onClick}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DetailModal({
  title,
  subtitle,
  sections,
  isOpen,
  onClose,
  actions,
}: DetailDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-slate-900 rounded-2xl border border-slate-800 z-50 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
                {subtitle && (
                  <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {sections.map((section, idx) => (
                <div key={idx} className="bg-slate-800/30 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Target size={16} className="text-brand-accent" />
                    {section.title}
                  </h3>
                  <p className="text-slate-300 text-sm">{section.content}</p>

                  {section.items && section.items.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="bg-slate-900/50 rounded-lg p-3"
                        >
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                            {item.label}
                          </div>
                          <div className="text-white font-mono font-bold">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {actions && actions.length > 0 && (
              <div className="p-6 border-t border-slate-800 space-y-3">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-brand-accent text-black rounded-xl font-bold hover:bg-white transition-all"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
