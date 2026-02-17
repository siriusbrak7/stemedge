import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, RefreshCcw } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const CosmicTutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Greetings, Explorer! I'm Nova, your Cosmic Tutor. Ask me anything about math, science, or the universe!", timestamp: Date.now() }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Format history for the service
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await getGeminiResponse(userMessage.text, history);
      
      const botMessage: ChatMessage = { 
        role: 'model', 
        text: responseText || "I seem to have lost connection with the mothership. Try again!", 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Signal interference detected. Please try asking again.", 
        timestamp: Date.now() 
      }]);
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

  return (
    <section id="tutor" className="py-24 relative overflow-hidden">
        {/* Background Gradients for section */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-900/10 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Side: Copy */}
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Powered by Gemini 2.0</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Your Personal <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                            Cosmic Navigator
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                        Stuck on a calculus problem? Curious about black holes? 
                        Nova is here 24/7 to guide you through the galaxy of knowledge. 
                        No judgment, just pure learning powered by advanced AI.
                    </p>
                    
                    <div className="flex flex-col gap-4">
                        {[
                            "Explain Quantum Physics like I'm 5",
                            "Solve this quadratic equation",
                            "Why is Mars red?",
                            "Help me write a biology lab report"
                        ].map((prompt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => {
                                    setInput(prompt);
                                    // Optional: auto-send or focus
                                    const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
                                    inputEl?.focus();
                                }}
                                className="text-left px-6 py-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 transition-all text-slate-300 text-sm flex items-center justify-between group"
                            >
                                {prompt}
                                <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-purple-400" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Side: Chat Interface */}
                <div className="relative">
                    {/* Glow effect behind chat */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30"></div>
                    
                    <div className="relative bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col h-[600px] overflow-hidden">
                        
                        {/* Chat Header */}
                        <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Nova</h3>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setMessages([{ role: 'model', text: "Systems recharged. What shall we explore?", timestamp: Date.now() }])}
                                className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                                title="Reset Chat"
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                            {messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${
                                        msg.role === 'user' 
                                            ? 'bg-purple-600 text-white rounded-br-none' 
                                            : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                                    }`}>
                                        <div className="flex items-start gap-2">
                                           {msg.role === 'model' && <Sparkles className="w-4 h-4 mt-1 text-purple-400 flex-shrink-0" />}
                                           <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 rounded-2xl rounded-bl-none p-4 border border-slate-700 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-slate-800 bg-slate-900">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about the universe..."
                                    disabled={loading}
                                    className="w-full bg-slate-800 text-white placeholder-slate-500 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-slate-700 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default CosmicTutor;