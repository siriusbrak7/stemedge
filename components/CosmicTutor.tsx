import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { aiTutorService } from '../services/aiTutorService';
import { Send, X, Loader, Bot, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    text: string;
    timestamp: number;
}

const CosmicTutor: React.FC = () => {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            text: `Hi ${user?.username?.split('@')[0] || 'explorer'}! I'm your Cosmic Tutor. Ask me anything about biology, chemistry, or physics!`,
            timestamp: Date.now()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            text: input,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await aiTutorService.generateResponse(input);
            
            if (response.error) {
                setError(response.error);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: "I'm having trouble connecting right now. Please try again later.",
                    timestamp: Date.now()
                }]);
            } else if (response.text) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: response.text,
                    timestamp: Date.now()
                }]);
            }
        } catch (err: any) {
            setError(err.message);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: "An error occurred. Please try again.",
                timestamp: Date.now()
            }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full shadow-lg hover:opacity-90 transition-all"
            >
                <Bot className="w-6 h-6 text-white" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Cosmic Tutor</h3>
                        <p className="text-xs text-slate-400">Powered by Gemini 2.5 Flash</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
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
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-[10px] mt-1 opacity-50">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none">
                            <Loader className="w-5 h-5 text-slate-400 animate-spin" />
                        </div>
                    </div>
                )}
                {error && (
                    <div className="flex justify-center">
                        <div className="bg-red-900/20 border border-red-500/30 p-2 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
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
                        placeholder="Ask your cosmic tutor..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CosmicTutor;
