import React from 'react';
import { X, FileText, Mail, Shield, CreditCard, Construction } from 'lucide-react';

export type PlaceholderType = 'pricing' | 'contact' | 'privacy' | 'terms' | 'demo' | 'coming_soon' | null;

interface Props {
    type: PlaceholderType;
    onClose: () => void;
}

const PlaceholderModal: React.FC<Props> = ({ type, onClose }) => {
    if (!type) return null;

    const renderContent = () => {
        switch(type) {
            case 'pricing':
                return {
                    icon: <CreditCard className="w-8 h-8 text-cyan-400" />,
                    title: "Pricing Plans",
                    body: (
                        <div className="text-center">
                            <p className="text-slate-300 mb-6">Our galactic subscription tiers are launching soon. Early access cadets get free premium access!</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                                    <h4 className="font-bold text-white">Cadet (Free)</h4>
                                    <p className="text-sm text-slate-400">Basic courses, limited AI queries.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-500/50">
                                    <h4 className="font-bold text-white">Commander (Pro)</h4>
                                    <p className="text-sm text-slate-400">Coming Soon: Unlimited Nova AI, advanced certifications.</p>
                                </div>
                            </div>
                        </div>
                    )
                };
            case 'contact':
                return {
                    icon: <Mail className="w-8 h-8 text-purple-400" />,
                    title: "Contact Mission Control",
                    body: (
                        <div className="space-y-4">
                            <p className="text-slate-300">We'd love to hear from you. Please fill out the form below (Simulation).</p>
                            <input type="text" placeholder="Name" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
                            <input type="email" placeholder="Email" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
                            <textarea placeholder="Message" rows={3} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"></textarea>
                            <button onClick={() => { alert('Message sent to the void!'); onClose(); }} className="w-full py-2 bg-purple-600 rounded text-white font-bold">Send Transmission</button>
                        </div>
                    )
                };
            case 'privacy':
            case 'terms':
                return {
                    icon: <Shield className="w-8 h-8 text-green-400" />,
                    title: type === 'privacy' ? "Privacy Policy" : "Terms of Service",
                    body: (
                        <div className="text-sm text-slate-400 space-y-4 max-h-60 overflow-y-auto pr-2">
                            <p><strong>1. Introduction</strong><br/>Welcome to StemEdge. We value your privacy across the galaxy.</p>
                            <p><strong>2. Data Collection</strong><br/>We collect minimal data to power your educational journey. Your progress is stored securely.</p>
                            <p><strong>3. AI Interactions</strong><br/>Chats with Nova are processed to provide answers but are not personally identifiable in our public datasets.</p>
                            <p>This is a placeholder legal document for the demo application.</p>
                        </div>
                    )
                };
            case 'demo':
                return {
                    icon: <FileText className="w-8 h-8 text-slate-400" />,
                    title: "Demo Video",
                    body: (
                        <div className="text-center">
                            <p className="mb-4 text-slate-300">Watch StemEdge in action.</p>
                            <div className="aspect-video bg-black rounded-xl flex items-center justify-center border border-slate-700">
                                <span className="text-slate-500">Video Placeholder (YouTube Embed)</span>
                            </div>
                        </div>
                    )
                }
            case 'coming_soon':
                return {
                    icon: <Construction className="w-8 h-8 text-amber-400" />,
                    title: "Under Construction",
                    body: (
                        <div className="text-center">
                            <p className="text-slate-300 mb-4">This module is currently being assembled in our orbital shipyard.</p>
                            <button onClick={onClose} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors">
                                Return to Base
                            </button>
                        </div>
                    )
                }
            default:
                return { icon: null, title: "", body: null };
        }
    };

    const content = renderContent();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {content.icon}
                        <h2 className="text-xl font-bold text-white">{content.title}</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {content.body}
                </div>
            </div>
        </div>
    );
};

export default PlaceholderModal;