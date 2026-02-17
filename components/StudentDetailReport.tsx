import React, { useState, useEffect } from 'react';
import { StudentMetric, TeacherNote } from '../types';
import { reportService } from '../services/reportService';
import { 
    ArrowLeft, User, Clock, AlertTriangle, 
    CheckCircle, MessageSquare, FileText, 
    Send, Trash2, BookOpen, Brain, Download
} from 'lucide-react';

interface Props {
    student: StudentMetric;
    onBack: () => void;
}

const StudentDetailReport: React.FC<Props> = ({ student, onBack }) => {
    const [notes, setNotes] = useState<TeacherNote[]>([]);
    const [newNote, setNewNote] = useState('');
    
    // Mock Data for Charts
    const topicPerformance = [
        { label: 'Cells', score: 85, completed: 100 },
        { label: 'Genetics', score: student.averageScore, completed: student.overallProgress },
        { label: 'Ecology', score: Math.max(0, student.averageScore - 15), completed: 40 },
        { label: 'Physio', score: Math.max(0, student.averageScore - 5), completed: 60 },
    ];

    useEffect(() => {
        setNotes(reportService.getNotes(student.id));
    }, [student.id]);

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const note = reportService.addNote('teacher', student.id, newNote);
        setNotes(prev => [note, ...prev]);
        setNewNote('');
    };

    const handleDeleteNote = (id: string) => {
        if (confirm('Delete this note?')) {
            reportService.deleteNote(id);
            setNotes(prev => prev.filter(n => n.id !== id));
        }
    };

    return (
        <div className="animate-fade-in-right">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Class Report
            </button>

            {/* HEADER */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {student.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{student.name}</h1>
                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                <span>ID: {student.id}</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Active: {new Date(student.lastActive).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                            <MessageSquare className="w-4 h-4" /> Message
                        </button>
                        <button 
                            onClick={() => reportService.downloadCSV([{...student, notes: notes.map(n=>n.text).join('; ')}], `report_${student.name}.csv`)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg shadow-purple-900/20"
                        >
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                        <p className="text-xs text-slate-500 uppercase mb-1">Overall Progress</p>
                        <p className="text-2xl font-bold text-white">{student.overallProgress}%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                        <p className="text-xs text-slate-500 uppercase mb-1">Avg Quiz Score</p>
                        <p className={`text-2xl font-bold ${student.averageScore >= 80 ? 'text-green-400' : student.averageScore >= 70 ? 'text-amber-400' : 'text-red-400'}`}>
                            {student.averageScore}%
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                        <p className="text-xs text-slate-500 uppercase mb-1">Assignments</p>
                        <p className="text-2xl font-bold text-cyan-400">{student.topicsCompleted}/12</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                        <p className="text-xs text-slate-500 uppercase mb-1">Status</p>
                        <p className={`text-xl font-bold flex items-center gap-2 ${student.atRisk ? 'text-red-400' : 'text-green-400'}`}>
                            {student.atRisk ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            {student.atRisk ? 'At Risk' : 'On Track'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* LEFT COL: HISTORY & NOTES */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Activity Feed */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-400" /> Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {[1,2,3].map((_, i) => (
                                <div key={i} className="flex gap-4 pb-4 border-b border-slate-800/50 last:border-0 last:pb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                                        <div className="w-0.5 h-full bg-slate-800 mt-1"></div>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 text-sm">
                                            {i === 0 ? "Completed 'Cell Biology' Quiz" : i === 1 ? "Started 'Genetics' Module" : "Logged in"}
                                        </p>
                                        <p className="text-slate-500 text-xs mt-1">
                                            {i === 0 ? "Score: 85% • 2 hours ago" : i === 1 ? "Yesterday" : "3 days ago"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Teacher Notes */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-400" /> Private Notes
                        </h3>
                        
                        <div className="flex gap-2 mb-6">
                            <textarea 
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add a private note about this student..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 min-h-[80px]"
                            />
                            <button 
                                onClick={handleAddNote}
                                disabled={!newNote.trim()}
                                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl px-4 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {notes.length === 0 ? (
                                <p className="text-center text-slate-500 text-sm py-4 italic">No notes yet.</p>
                            ) : (
                                notes.map(note => (
                                    <div key={note.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 group relative">
                                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{note.text}</p>
                                        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                                            <button 
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: PERFORMANCE CHARTS */}
                <div className="space-y-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-amber-400" /> Topic Breakdown
                        </h3>
                        
                        <div className="space-y-6">
                            {topicPerformance.map((topic, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-white font-medium">{topic.label}</span>
                                        <span className={`font-bold ${topic.score >= 80 ? 'text-green-400' : topic.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                                            {topic.score}%
                                        </span>
                                    </div>
                                    {/* Dual Progress Bar (Score vs Completion) */}
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
                                        <div 
                                            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500" 
                                            style={{ width: `${topic.score}%` }} 
                                            title="Quiz Score"
                                        />
                                    </div>
                                    <div className="mt-1 flex justify-between text-[10px] text-slate-500">
                                        <span>Mastery Score</span>
                                        <span>{topic.completed}% Material Covered</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                            <h4 className="text-sm font-bold text-white mb-2">Recommendation</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {student.averageScore < 70 
                                    ? "Student is struggling with foundational concepts. Assign 'Cell Structure' remediation module." 
                                    : "Student is performing well. Consider assigning advanced 'Genetics' projects."}
                            </p>
                            <button className="mt-3 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700">
                                Assign Remediation
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentDetailReport;