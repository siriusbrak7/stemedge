
import React, { useState, useEffect } from 'react';
import { Rocket, Menu, X, LogOut, Settings } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onOpenAuth, onLogout, onOpenSettings }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Updated Links as per request
  const navLinks = [
    { name: 'Mission', href: '#mission' },
    { name: 'Features', href: '#features' },
    { name: 'Cosmic Tutor', href: '#tutor' },
    { name: 'Crew', href: '#crew' },
  ];

  const handleNavClick = () => {
      setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
      e.preventDefault();
      // Use window.location for full reload/reset if needed, or scroll
      if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          window.location.href = '/';
      }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a 
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              StemEdge
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {!user ? (
                 navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-slate-300 hover:text-cyan-400 transition-colors text-sm font-medium uppercase tracking-widest hover:scale-105"
                    >
                      {link.name}
                    </a>
                  ))
              ) : user.role === 'admin' ? (
                  <span className="text-red-400 font-mono text-sm border border-red-900 bg-red-900/20 px-2 py-1 rounded">ADMIN MODE</span>
              ) : (
                  <span className="text-cyan-400 font-mono text-sm border border-cyan-900 bg-cyan-900/20 px-2 py-1 rounded uppercase">{user.role} DASHBOARD</span>
              )}

              {user ? (
                  <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                      <div className="flex items-center gap-2 text-white">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="font-bold text-xs">{user.username.substring(0,2).toUpperCase()}</span>
                          </div>
                          <span className="text-sm font-medium">{user.username}</span>
                      </div>
                      <button 
                        onClick={onOpenSettings}
                        className="p-2 hover:text-cyan-400 text-slate-400 transition-colors"
                        title="Settings"
                      >
                          <Settings className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={onLogout}
                        className="p-2 hover:text-red-400 text-slate-400 transition-colors"
                        title="Logout"
                      >
                          <LogOut className="w-5 h-5" />
                      </button>
                  </div>
              ) : (
                <button 
                    onClick={onOpenAuth}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] active:scale-95"
                >
                    Sign In
                </button>
              )}
            </div>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 absolute w-full shadow-2xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {!user && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-300 hover:text-cyan-400 block px-3 py-3 rounded-lg text-base font-bold uppercase tracking-wider hover:bg-slate-900"
                onClick={handleNavClick}
              >
                {link.name}
              </a>
            ))}
            
            {user ? (
                <div className="border-t border-slate-800 mt-4 pt-4">
                     <p className="text-slate-400 text-xs uppercase mb-2">Signed in as</p>
                     <div className="flex items-center gap-3 mb-6 bg-slate-900 p-3 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <span className="font-bold text-xs text-white">{user.username.substring(0,2).toUpperCase()}</span>
                        </div>
                        <p className="text-white font-bold">{user.username}</p>
                     </div>
                     <button 
                        onClick={() => { onOpenSettings(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left text-slate-300 hover:text-white py-3 flex items-center gap-2"
                     >
                         <Settings className="w-5 h-5" /> App Settings
                     </button>
                     <button 
                        onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                        className="w-full text-left text-red-400 py-3 flex items-center gap-2"
                     >
                         <LogOut className="w-5 h-5" /> Log Out
                     </button>
                </div>
            ) : (
                <button 
                    onClick={() => { onOpenAuth(); setIsMobileMenuOpen(false); }}
                    className="w-full mt-4 px-6 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg"
                >
                    Sign In / Launch App
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
