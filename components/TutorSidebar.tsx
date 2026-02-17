
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Sparkles, AlertCircle } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { studentDataService } from '../services/studentDataService';
import { ChatMessage, User } from '../types';
import SiriusStar from './SiriusStar';

interface TutorSidebarProps {
    user: User;
}

const HISTORY_KEY = 'stemedge_chat_history';

const TutorSidebar: React.FC<TutorSidebarProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [siriusState, setSiriusState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load history
    useEffect(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            try {
                setMessages(JSON.parse(stored));
            } catch (e) {
                setMessages([{ role: 'model', text: `Greetings, ${user.username}. I am Sirius. Ready to illuminate your path?`, timestamp: Date.now() }]);
            }
        } else {
            setMessages([{ role: 'model', text: `Greetings, ${user.username}. I am Sirius. Ready to illuminate your path?`, timestamp: Date.now() }]);
        }
    }, [user.username]);

    // Save history
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
        }
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setSiriusState('thinking');

        try {
            const history = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));

            // Fetch generic context
            let context = { username: user.username, recentTopics: [] as any[] };
            try {
                const dashboard = await studentDataService.getDashboardData(user.username);
                const active = dashboard.topics.filter(t => dashboard.progress[t.id] && !dashboard.progress[t.id].isCompleted);
                context.recentTopics = active;
            } catch (e) {
                // Ignore context errors
            }

            const responseText = await getGeminiResponse(userMessage.text, history, context);
            
            const botMessage: ChatMessage = { 
                role: 'model', 
                text: responseText || "The stars are silent right now.", 
                timestamp: Date.now() 
            };
            
            setMessages(prev => [...prev, botMessage]);
            setSiriusState('speaking');
            setTimeout(() => setSiriusState('idle'), 3000);

        } catch (error) {
             setMessages(prev => [...prev, { role: 'model', text: "Orbit unstable. Please try again.", timestamp: Date.now() }]);
             setSiriusState('idle');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform group"
                title="Ask Sirius"
            >
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
                <SiriusStar state="idle" size="sm" />
            </button>
        );
    }

    return (
        <div className={`fixed z-40 transition-all duration-500 shadow-2xl bg-slate-900/95 backdrop-blur border border-slate-700 overflow-hidden flex flex-col rounded-2xl
            ${isMinimized 
                ? 'bottom-6 right-6 w-80 h-20' 
                : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[100dvh] sm:h-[600px]'
            }
        `}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b border-slate-800 ${isMinimized ? 'h-full border-none cursor-pointer' : ''}`}
                 onClick={isMinimized ? () => setIsMinimized(false) : undefined}
            >
                <div className="flex items-center gap-3">
                    <SiriusStar state={siriusState} size="sm" />
                    <div>
                        <h3 className="font-bold text-white text-lg tracking-wide">Sirius</h3>
                        {!isMinimized && <p className="text-[10px] text-cyan-400 uppercase tracking-widest">AI Tutor Online</p>}
                    </div>
                </div>

                {isMinimized ? (
                     <div className="text-slate-400 text-xs mr-2 animate-pulse">Click to expand</div>
                ) : (
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                        >
                            <Minimize2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-red-900/30 rounded-lg text-slate-400 hover:text-red-400"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Chat Content */}
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-4">
                                <Sparkles className="w-8 h-8 opacity-50" />
                                <p className="text-sm">I can help with complex topics,<br/>quizzes, and explanations.</p>
                            </div>
                        )}
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                                    msg.role === 'user' 
                                        ? 'bg-purple-600 text-white rounded-br-none' 
                                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800 rounded-2xl rounded-bl-none p-4 border border-slate-700 flex items-center gap-2">
                                    <SiriusStar state="thinking" size="sm" />
                                    <span className="text-xs text-slate-400 animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-slate-900 border-t border-slate-800">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setSiriusState('listening');
                                }}
                                onBlur={() => setSiriusState('idle')}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Sirius..."
                                disabled={loading}
                                className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 border border-slate-700 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white shadow-lg disabled:opacity-50 disabled:bg-slate-700 transition-all"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-slate-600">
                                Sirius can make mistakes. Verify important info.
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TutorSidebar;
