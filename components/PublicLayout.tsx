import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AuthModal from './AuthModal';

const PublicLayout: React.FC = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <Navbar 
                user={null}
                onLogout={() => {}}
                onOpenSettings={() => {}}
                onOpenAuth={() => setIsAuthOpen(true)}
            />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer 
                onOpenPlaceholder={() => {}}
                onOpenAuth={() => setIsAuthOpen(true)}
            />
            <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
            />
        </div>
    );
};

export default PublicLayout;