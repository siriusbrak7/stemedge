import React, { useState } from 'react';
import { Rocket, Twitter, Github, Linkedin, Mail, Check } from 'lucide-react';
import { PlaceholderType } from './PlaceholderModal';

interface FooterProps {
    onOpenPlaceholder: (type: PlaceholderType) => void;
    onOpenAuth: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenPlaceholder, onOpenAuth }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
      if (email) {
          localStorage.setItem('newsletter_email', email);
          setSubscribed(true);
          setEmail('');
      }
  };

  const handleSocialClick = (platform: string) => {
      alert(`Opening ${platform} (Placeholder)`);
  };

  return (
    <footer className="relative bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-purple-500" />
              <span className="text-2xl font-bold text-white">StemEdge</span>
            </div>
            <p className="text-slate-500 text-sm">
              Empowering the next generation of scientists, engineers, and dreamers to reach for the stars.
            </p>
            <div className="flex space-x-4 pt-2">
               <button onClick={() => handleSocialClick('Twitter')} className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></button>
               <button onClick={() => handleSocialClick('Github')} className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></button>
               <button onClick={() => handleSocialClick('LinkedIn')} className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></button>
               <button onClick={() => onOpenPlaceholder('contact')} className="text-slate-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={onOpenAuth} className="hover:text-cyan-400 transition-colors">Courses</button></li>
              <li><button onClick={onOpenAuth} className="hover:text-cyan-400 transition-colors">Tutor AI</button></li>
              <li><button onClick={() => onOpenPlaceholder('pricing')} className="hover:text-cyan-400 transition-colors">Pricing</button></li>
              <li><button onClick={() => onOpenPlaceholder('contact')} className="hover:text-cyan-400 transition-colors">For Schools</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => onOpenPlaceholder('coming_soon')} className="hover:text-cyan-400 transition-colors">Blog</button></li>
              <li><button onClick={() => onOpenPlaceholder('coming_soon')} className="hover:text-cyan-400 transition-colors">Community</button></li>
              <li><button onClick={() => onOpenPlaceholder('contact')} className="hover:text-cyan-400 transition-colors">Help Center</button></li>
              <li><button onClick={() => onOpenPlaceholder('privacy')} className="hover:text-cyan-400 transition-colors">Safety Guidelines</button></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-semibold mb-4">Stay in Orbit</h4>
             <p className="text-slate-500 text-sm mb-4">Subscribe to our newsletter for cosmic updates.</p>
             <div className="flex gap-2">
                 {subscribed ? (
                     <div className="w-full bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2 text-green-400 flex items-center justify-center gap-2">
                         <Check className="w-4 h-4" /> Subscribed
                     </div>
                 ) : (
                    <>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-full"
                        />
                        <button 
                            onClick={handleSubscribe}
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Join
                        </button>
                    </>
                 )}
             </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>&copy; {new Date().getFullYear()} StemEdge Inc. All rights reserved.</p>
            <div className="flex gap-6">
                <button onClick={() => onOpenPlaceholder('privacy')} className="hover:text-slate-400">Privacy Policy</button>
                <button onClick={() => onOpenPlaceholder('terms')} className="hover:text-slate-400">Terms of Service</button>
                <button onClick={() => onOpenPlaceholder('privacy')} className="hover:text-slate-400">Cookie Policy</button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;