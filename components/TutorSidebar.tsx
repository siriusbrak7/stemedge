import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { aiTutorService } from '../services/aiTutorService';
import SiriusStar from './SiriusStar';
import { Send, X, Loader, AlertCircle, Bot, Sparkles } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

const TutorSidebar: React.FC = () => {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: `Hi ${user?.username?.split('@')[0] || 'there'}! I'm Sirius, your STEM tutor. Ask me anything about biology, chemistry, physics, or math!`,
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [aiState, setAiState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setAiState('thinking');
        setError(null);

        try {
            // Determine current topic from URL or context (simplified)
            const currentTopic = window.location.pathname.includes('/lesson/') 
                ? window.location.pathname.split('/').pop() 
                : undefined;

            const response = await aiTutorService.generateResponse(input, currentTopic);
            
            setAiState('speaking');
            
            if (response.error) {
                setError(response.error);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "I'm having trouble connecting right now. Please try again later.",
                    timestamp: Date.now()
                }]);
            } else if (response.text) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.text,
                    timestamp: Date.now()
                }]);
            }

            setTimeout(() => setAiState('idle'), 2000);
        } catch (err: any) {
            setError(err.message);
            setAiState('idle');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 group"
                aria-label="Open Sirius AI Tutor"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <SiriusStar state="idle" size="lg" />
                </div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <SiriusStar state={aiState} size="sm" />
                    <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                            Sirius AI Tutor <Sparkles className="w-4 h-4 text-amber-400" />
                        </h3>
                        <p className="text-xs text-slate-400">Grades 6-12 • STEM</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[400px]">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl ${
                                msg.role === 'user'
                                    ? 'bg-cyan-600 text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-[10px] mt-1 opacity-50">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex justify-center">
                        <div className="bg-red-900/20 border border-red-500/30 p-2 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4" />
                            <span>Connection issue. Please try again.</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask Sirius anything..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="p-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                    Powered by Gemini 2.5 Flash • Ages 12-18
                </p>
            </div>
        </div>
    );
};

export default TutorSidebar;
