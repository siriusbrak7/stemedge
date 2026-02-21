import React, { useState, useEffect } from 'react';
import { VirtualLab, LabAttempt } from '../types';
import { labService } from '../services/labService';
import { FlaskConical, Clock, Award, CheckCircle, ArrowRight, PlayCircle } from 'lucide-react';

interface Props {
    studentId: string;
    onStartLab: (lab: VirtualLab) => void;
}

const VirtualLabsList: React.FC<Props> = ({ studentId, onStartLab }) => {
    const [labs, setLabs] = useState<VirtualLab[]>([]);
    const [attempts, setAttempts] = useState<LabAttempt[]>([]);

    useEffect(() => {
        setLabs(labService.getAllLabs());
        setAttempts(labService.getStudentAttempts(studentId));
    }, [studentId]);

    const getLabStatus = (labId: string) => {
        const attempt = attempts.find(a => a.labId === labId);
        if (!attempt) return 'not_started';
        return attempt.isCompleted ? 'completed' : 'in_progress';
    };

    return (
        <div className="animate-fade-in-up">
            <div className="grid md:grid-cols-2 gap-6">
                {labs.map(lab => {
                    const status = getLabStatus(lab.id);
                    const ENABLED_LABS = lab.id === 'lab-cell-staining'; // Only enable this one for Phase 1

                    return (
                        <div 
                            key={lab.id}
                            className={`relative bg-slate-900 border rounded-2xl p-6 transition-all ${
                                isCellLab 
                                    ? 'border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/80 group cursor-pointer' 
                                    : 'border-slate-800 opacity-60 cursor-not-allowed'
                            }`}
                            onClick={() => isCellLab && onStartLab(lab)}
                        >
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                                {status === 'completed' && <div className="bg-green-900/20 text-green-400 p-1 rounded-full"><CheckCircle className="w-5 h-5" /></div>}
                                {status === 'in_progress' && <div className="bg-amber-900/20 text-amber-400 text-xs font-bold px-2 py-1 rounded">RESUME</div>}
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-xl ${isCellLab ? 'bg-purple-900/20 text-purple-400' : 'bg-slate-800 text-slate-500'}`}>
                                    <FlaskConical className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{lab.title}</h3>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lab.estimatedTime}m</span>
                                        <span className="flex items-center gap-1">
                                            <Award className="w-3 h-3" /> 
                                            Level {lab.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 mb-6 min-h-[40px]">
                                {lab.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {isCellLab ? 'Available' : 'Coming Soon'}
                                </span>
                                {isCellLab && (
                                    <button className="flex items-center gap-2 text-sm font-bold text-cyan-400 group-hover:text-white transition-colors">
                                        {status === 'not_started' ? 'Enter Lab' : 'Continue'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VirtualLabsList;