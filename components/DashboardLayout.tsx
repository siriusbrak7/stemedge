
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';
import { useUser } from '../contexts/UserContext';
import StarField from './StarField';

const DashboardLayout: React.FC = () => {
    const { user, logout } = useUser();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 flex">
            <StarField />
            
            {/* Sidebar */}
            <DashboardSidebar user={user} onLogout={logout} />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative z-10">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
