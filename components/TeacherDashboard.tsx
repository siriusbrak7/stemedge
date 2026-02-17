
import React, { useState, useEffect } from 'react';
import { User, Classroom, Assignment } from '../types';
import { teacherDataService } from '../services/teacherDataService';
import { assignmentService } from '../services/assignmentService';
import { 
    Users, BookOpen, Activity, AlertTriangle, 
    ChevronRight, TrendingUp, Clock, Search, 
    Download, Plus, ArrowLeft, MoreHorizontal,
    Brain, FileBarChart, Calendar, ClipboardList, FlaskConical, Youtube
} from 'lucide-react';
import AssignmentBuilder from './AssignmentBuilder';
import ProgressReports from './ProgressReports';
import VideoManager from './teacher/VideoManager';

interface Props {
    user: User;
}

const TeacherDashboard: React.FC<Props> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'reports' | 'videos' | 'labs'>('overview');
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showBuilder, setShowBuilder] = useState(false);

    const refreshData = async () => {
        // Use ID if available (Supabase), else username (Demo)
        const identifier = user.id || user.username;
        const classData = await teacherDataService.fetchClassesAsync(identifier);
        setClasses(classData);
        try {
            const asgData = await assignmentService.getAssignmentsForTeacher(identifier);
            setAssignments(asgData || []);
        } catch (error) {
            console.error("Failed to load assignments", error);
            setAssignments([]);
        }
    };

    useEffect(() => {
        const load = async () => {
            await refreshData();
            setLoading(false);
        };
        load();
    }, [user.id, user.username]);

    const getHealthColor = (health: 'good' | 'average' | 'critical') => {
        switch(health) {
            case 'good': return 'text-green-400 border-green-500/30 bg-green-500/10';
            case 'average': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
            case 'critical': return 'text-red-400 border-red-500/30 bg-red-500/10';
            default: return 'text-slate-400 border-slate-700 bg-slate-800';
        }
    };

    const handleDownloadReport = () => {
        const text = "Student Name,Progress,Average Score\n" + 
            (selectedClass ? selectedClass.students.map(s => `${s.name},${s.overallProgress}%,${s.averageScore}%`).join('\n') : "");
        
        const element = document.createElement("a");
        const file = new Blob([text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `report_${selectedClass?.id || 'all'}.csv`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleCreateClass = () => {
        const name = prompt("Enter Class Name:");
        if (name) {
            alert(`Class "${name}" created! (Mock)`);
        }
    };

    if (loading) {
         return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 animate-pulse">Accessing Command Center...</p>
                </div>
            </div>
        );
    }

    if (showBuilder) {
        return (
            <AssignmentBuilder 
                user={user} 
                onClose={() => setShowBuilder(false)} 
                onSave={() => {
                    refreshData();
                    setActiveTab('assignments');
                }}
            />
        );
    }

    // --- VIEW 2: CLASS DETAIL (Selected Class) ---
    if (selectedClass) {
        
        // Filter students based on search
        const filteredStudents = selectedClass.students.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const strugglingStudents = selectedClass.students.filter(s => s.atRisk);
        const inactiveStudents = selectedClass.students.filter(s => (Date.now() - s.lastActive) > (5 * 24 * 60 * 60 * 1000));
        const enrichmentStudents = selectedClass.students.filter(s => s.averageScore > 90);

        return (
            <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in-up">
                <button 
                    onClick={() => setSelectedClass(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Overview
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">{selectedClass.name}</h1>
                            <p className="text-slate-400 flex items-center gap-2">
                                {selectedClass.subject} • {selectedClass.studentCount} Students
                            </p>
                        </div>
                        <div className="flex gap-3">
                             <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors hover:bg-slate-700">
                                <Download className="w-4 h-4" /> Export Data
                            </button>
                            <button onClick={() => setShowBuilder(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium">
                                <BookOpen className="w-4 h-4" /> Assign Topic
                            </button>
                        </div>
                    </div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                            <p className="text-slate-500 text-xs uppercase mb-1">Class Average</p>
                            <p className={`text-2xl font-bold ${selectedClass.averageScore >= 80 ? 'text-green-400' : 'text-amber-400'}`}>{selectedClass.averageScore}%</p>
                        </div>
                        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                            <p className="text-slate-500 text-xs uppercase mb-1">Completion Rate</p>
                            <p className="text-2xl font-bold text-cyan-400">{selectedClass.averageProgress}%</p>
                        </div>
                         <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                            <p className="text-slate-500 text-xs uppercase mb-1">At Risk</p>
                            <p className={`text-2xl font-bold ${strugglingStudents.length > 0 ? 'text-red-400' : 'text-slate-200'}`}>{strugglingStudents.length} Students</p>
                        </div>
                        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                            <p className="text-slate-500 text-xs uppercase mb-1">Top Performers</p>
                            <p className="text-2xl font-bold text-purple-400">{enrichmentStudents.length} Students</p>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-cyan-400" /> Roster</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input type="text" placeholder="Search student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 w-48 md:w-64" />
                            </div>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase font-medium text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Student Name</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Progress</th>
                                        <th className="px-6 py-4">Avg Score</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-white">{student.name}</div>
                                                <div className="text-xs text-slate-500">ID: {student.id.substring(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.atRisk ? <span className="text-red-400 bg-red-900/20 px-2 py-0.5 rounded text-xs border border-red-900/50">Needs Help</span> : <span className="text-slate-400">Active</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="w-24 h-1.5 bg-slate-800 rounded-full mb-1"><div className="h-full bg-cyan-500 rounded-full" style={{ width: `${student.overallProgress}%` }}></div></div>
                                                <span className="text-xs text-slate-400">{student.overallProgress}% Complete</span>
                                            </td>
                                            <td className="px-6 py-4"><span className={`font-mono font-bold ${student.averageScore < 70 ? 'text-red-400' : 'text-white'}`}>{student.averageScore}%</span></td>
                                            <td className="px-6 py-4 text-right"><button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"><MoreHorizontal className="w-4 h-4" /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* Simplified Sidebar for Detail View */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                            <button onClick={() => setShowBuilder(true)} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all text-sm text-slate-300 flex items-center justify-between group">Manage Assignments <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-white" /></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN DASHBOARD VIEW ---

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
                    <p className="text-slate-400">Manage your academic fleet.</p>
                </div>
                <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'assignments', label: 'Assignments' },
                        { id: 'reports', label: 'Reports' },
                        { id: 'videos', label: 'Videos' },
                        { id: 'labs', label: 'Labs' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                                activeTab === tab.id ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Class Cards */}
                        {classes.map((cls) => (
                            <div 
                                key={cls.id} 
                                onClick={() => setSelectedClass(cls)}
                                className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/50 hover:bg-slate-800 transition-all cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 group-hover:border-purple-500/30 transition-colors">
                                        <Users className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider border ${getHealthColor(cls.health)}`}>
                                        {cls.health === 'critical' ? 'Attention' : cls.health}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{cls.name}</h3>
                                <p className="text-slate-400 text-sm mb-6">{cls.subject}</p>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase mb-1">Students</p>
                                        <p className="text-white font-mono font-bold text-lg">{cls.studentCount}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs uppercase mb-1">Avg Score</p>
                                        <p className={`font-mono font-bold text-lg ${cls.averageScore < 70 ? 'text-red-400' : 'text-green-400'}`}>
                                            {cls.averageScore}%
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        ))}
                         
                        {/* Create Class Card */}
                        <div 
                            onClick={handleCreateClass}
                            className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 hover:border-slate-700 transition-all min-h-[250px]"
                        >
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Create Class</h3>
                            <p className="text-slate-500 text-sm text-center">Add a new classroom to your dashboard.</p>
                        </div>
                    </div>
                </>
            )}

            {/* TAB: ASSIGNMENTS */}
            {activeTab === 'assignments' && (
                <div className="animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                             <ClipboardList className="w-5 h-5 text-purple-400" />
                             <h2 className="text-xl font-bold text-white">Active Assignments</h2>
                        </div>
                        <button 
                            onClick={() => setShowBuilder(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium shadow-lg shadow-purple-900/20"
                        >
                            <Plus className="w-4 h-4" /> New Assignment
                        </button>
                    </div>

                    <div className="space-y-4">
                        {assignments.length === 0 ? (
                            <div className="text-center py-12 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
                                <p className="text-slate-400">No active assignments. Create one to get started.</p>
                            </div>
                        ) : (
                            assignments.map(asg => (
                                <div key={asg.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-white text-lg">{asg.title}</h3>
                                                {asg.status === 'draft' && <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">DRAFT</span>}
                                            </div>
                                            <p className="text-sm text-slate-400 mb-2">
                                                Classes: {asg.classIds.map(cid => classes.find(c => c.id === cid)?.name).join(', ')}
                                            </p>
                                            <div className="flex gap-4 text-xs font-mono text-slate-500">
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {new Date(asg.dueDate).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {asg.items.length} Items</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Completion</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-cyan-500" 
                                                            style={{ width: `${(asg.completionCount! / asg.totalStudents!) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-white font-bold text-sm">{asg.completionCount}/{asg.totalStudents}</span>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
                <ProgressReports user={user} />
            )}

            {/* TAB: VIDEOS (New) */}
            {activeTab === 'videos' && (
                <VideoManager user={user} />
            )}

            {/* TAB: LABS (Placeholder) */}
            {activeTab === 'labs' && (
                <div className="animate-fade-in-up text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FlaskConical className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Virtual Lab Reports</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-8">
                        Detailed analytics on student lab performance, notebook entries, and identification accuracy will appear here.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-full text-purple-300 font-bold text-sm">
                        Coming in Phase 2
                    </div>
                </div>
            )}

        </div>
    );
};

export default TeacherDashboard;
