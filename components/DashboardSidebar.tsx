import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Settings, LogOut, Rocket
} from 'lucide-react';
import { User } from '../types';

interface Props {
    user: User;
    onLogout: () => void;
}

const DashboardSidebar: React.FC<Props> = ({ user, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-40">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                <div className="p-2 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20">
                    <Rocket className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-mono tracking-tight text-white">
                    StemEdge
                </span>
            </div>

            {/* Empty space - no navigation links */}
            <div className="flex-1"></div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-800 space-y-2">
                <button 
                    onClick={() => navigate('/dashboard/settings')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all text-sm font-medium"
                >
                    <Settings className="w-5 h-5" /> Settings
                </button>
                <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl transition-all text-sm font-medium"
                >
                    <LogOut className="w-5 h-5" /> Sign Out
                </button>
            </div>
        </div>
    );
};

export default DashboardSidebar;