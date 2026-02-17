
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CellStainingLab from './virtual-labs/CellStainingLab';
import { labService } from '../services/labService';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const LabPage: React.FC = () => {
    const { labId } = useParams<{ labId: string }>();
    const navigate = useNavigate();
    const { user } = useUser();
    
    const lab = labId ? labService.getLabById(labId) : undefined;

    if (!lab || !user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4">Lab Access Denied</h1>
                <p className="text-slate-400 mb-8">
                    {user ? 'Lab module not found.' : 'You must be logged in to access the laboratory.'}
                </p>
                <button 
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
            </div>
        );
    }

    if (labId === 'lab-cell-staining') {
        return (
            <CellStainingLab 
                lab={lab} 
                studentId={user.username} 
                onExit={() => navigate(-1)} 
            />
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
            <p className="text-white">Lab "{lab.title}" is currently under maintenance.</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-cyan-400 underline">Return</button>
        </div>
    );
};

export default LabPage;
