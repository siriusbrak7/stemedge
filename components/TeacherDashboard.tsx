import React, { useState, useEffect } from 'react';
import { User, Classroom, Assignment } from '../types';
import { teacherDataService } from '../services/teacherDataService';
import { assignmentService } from '../services/assignmentService';
import { 
    Users, BookOpen, Activity, AlertTriangle, 
    ChevronRight, TrendingUp, Clock, Search, 
    Download, Plus, ArrowLeft, MoreHorizontal,
    Brain, FileBarChart, Calendar, ClipboardList, 
    FlaskConical, Youtube, CheckCircle, XCircle,
    BarChart, PieChart, Award, Loader
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
    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [stats, setStats] = useState({
        totalStudents: 0,
        avgProgress: 0,
        assignmentsActive: 0,
        atRiskCount: 0
    });

    useEffect(() => {
        if (user.role === 'teacher') {
            const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            if (isDev && user.username.includes('test')) {
                setIsApproved(true);
            } else {
                setIsApproved(user.isApproved || false);
            }
        } else {
            setIsApproved(true);
        }
    }, [user]);

    const refreshData = async () => {
        const identifier = user.id || user.username;
        const classData = await teacherDataService.fetchClassesAsync(identifier);
        setClasses(classData);
        
        const totalStudents = classData.reduce((acc, cls) => acc + cls.studentCount, 0);
        const avgProgress = classData.length 
            ? Math.round(classData.reduce((acc, cls) => acc + cls.averageProgress, 0) / classData.length) 
            : 0;
        const atRiskCount = classData.reduce((acc, cls) => 
            acc + cls.students.filter(s => s.atRisk).length, 0
        );
        
        setStats({
            totalStudents,
            avgProgress,
            assignmentsActive: assignments.filter(a => a.status === 'published').length,
            atRiskCount
        });

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

    if (isApproved === false) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Clock className="w-10 h-10 text-amber-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Account Pending Approval</h2>
                    <p className="text-slate-400 mb-6">
                        Your teacher account is awaiting review by an administrator. 
                        You'll receive access once approved. This usually takes 24-48 hours.
                    </p>
                    <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-slate-400 mb-2">Registration details:</p>
                        <p className="text-white font-medium">{user.username}</p>
                        <p className="text-xs text-slate-500 mt-2">Joined: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                        Questions? Contact <span className="text-cyan-400">admin@stemed.com</span>
                    </div>
                </div>
            </div>
        );
    }

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

    const getHealthColor = (health: 'good' | 'average' | 'critical') => {
        switch(health) {
            case 'good': return 'text-green-400 border-green-500/30 bg-green-500/10';
            case 'average': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
            case 'critical': return 'text-red-400 border-red-500/30 bg-red-500/10';
            default: return 'text-slate-400 border-slate-700 bg-slate-800';
        }
    };

    const handleDownloadReport = () => {
        const text = "Student Name,Progress,Average Score,Status\n" + 
            (selectedClass ? selectedClass.students.map(s => 
                `${s.name},${s.overallProgress}%,${s.averageScore}%,${s.atRisk ? 'At Risk' : 'On Track'}`
            ).join('\n') : "");
        
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

    if (selectedClass) {
        
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
                                                {student.atRisk ? (
                                                    <span className="text-red-400 bg-red-900/20 px-2 py-0.5 rounded text-xs border border-red-900/50 flex items-center gap-1 w-fit">
                                                        <AlertTriangle className="w-3 h-3" /> Needs Help
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3 text-green-500/50" /> Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full">
                                                        <div className={`h-full rounded-full ${student.overallProgress < 40 ? 'bg-red-500' : student.overallProgress < 70 ? 'bg-amber-500' : 'bg-green-500'}`} 
                                                            style={{ width: `${student.overallProgress}%` }} />
                                                    </div>
                                                    <span className="text-xs text-slate-400">{student.overallProgress}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-mono font-bold ${
                                                    student.averageScore < 60 ? 'text-red-400' : 
                                                    student.averageScore < 75 ? 'text-amber-400' : 
                                                    'text-green-400'
                                                }`}>
                                                    {student.averageScore}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <BarChart className="w-4 h-4 text-cyan-400" />
                                Class Insights
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Struggling Students</span>
                                    <span className="text-white font-bold">{strugglingStudents.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Inactive (greater than 5 days)</span>
                                    <span className="text-white font-bold">{inactiveStudents.length}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400">Ready for Enrichment</span>
                                    <span className="text-white font-bold">{enrichmentStudents.length}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button onClick={() => setShowBuilder(true)} className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all text-sm text-slate-300 flex items-center justify-between group">
                                    Create Assignment <BookOpen className="w-4 h-4 text-slate-500 group-hover:text-white" />
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all text-sm text-slate-300 flex items-center justify-between group">
                                    Message Class <Users className="w-4 h-4 text-slate-500 group-hover:text-white" />
                                </button>
                                <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all text-sm text-slate-300 flex items-center justify-between group">
                                    Schedule Review <Calendar className="w-4 h-4 text-slate-500 group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
                    <p className="text-slate-400">Manage your academic fleet.</p>
                </div>
                <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
                        { id: 'assignments', label: 'Assignments', icon: <ClipboardList className="w-4 h-4" /> },
                        { id: 'reports', label: 'Reports', icon: <FileBarChart className="w-4 h-4" /> },
                        { id: 'videos', label: 'Videos', icon: <Youtube className="w-4 h-4" /> },
                        { id: 'labs', label: 'Labs', icon: <FlaskConical className="w-4 h-4" /> }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-2 ${
                                activeTab === tab.id ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-500 text-xs mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-500 text-xs mb-1">Avg Progress</p>
                    <p className="text-2xl font-bold text-cyan-400">{stats.avgProgress}%</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-500 text-xs mb-1">Active Assignments</p>
                    <p className="text-2xl font-bold text-purple-400">{stats.assignmentsActive}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <p className="text-slate-500 text-xs mb-1">At Risk</p>
                    <p className="text-2xl font-bold text-red-400">{stats.atRiskCount}</p>
                </div>
            </div>

            {activeTab === 'overview' && (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                                
                                <div className="mt-4 flex gap-1">
                                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500" style={{ width: `${cls.averageProgress}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-500">{cls.averageProgress}%</span>
                                </div>
                                
                                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </div>
                            </div>
                        ))}
                         
                        <div 
                            onClick={handleCreateClass}
                            className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 hover:border-slate-700 transition-all min-h-[280px]"
                        >
                            <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Create Class</h3>
                            <p className="text-slate-500 text-sm text-center max-w-[200px]">
                                Add a new classroom to your dashboard
                            </p>
                        </div>
                    </div>
                </>
            )}

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
                            <div className="text-center py-16 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
                                <ClipboardList className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-400 mb-2">No active assignments</p>
                                <p className="text-sm text-slate-500 mb-6">Create your first assignment to get started</p>
                                <button 
                                    onClick={() => setShowBuilder(true)}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Create Assignment
                                </button>
                            </div>
                        ) : (
                            assignments.map(asg => {
                                const classNames = asg.classIds
                                    .map(cid => classes.find(c => c.id === cid)?.name)
                                    .filter(Boolean)
                                    .join(', ');
                                
                                return (
                                    <div key={asg.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white text-lg">{asg.title}</h3>
                                                    {asg.status === 'draft' && (
                                                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                                                            DRAFT
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-400 mb-2 line-clamp-1">
                                                    {classNames || 'No classes assigned'}
                                                </p>
                                                <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> 
                                                        Due: {new Date(asg.dueDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="w-3 h-3" /> 
                                                        {asg.items.length} Items
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Completion</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-cyan-500" 
                                                                style={{ width: `${((asg.completionCount || 0) / (asg.totalStudents || 1)) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-white font-bold text-sm">
                                                            {asg.completionCount || 0}/{asg.totalStudents || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <ProgressReports user={user} />
            )}

            {activeTab === 'videos' && (
                <VideoManager user={user} />
            )}

            {activeTab === 'labs' && (
                <div className="animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-6">
                        <FlaskConical className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-xl font-bold text-white">Virtual Labs</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                                <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4">
                                    <FlaskConical className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Microscopy Lab {i}</h3>
                                <p className="text-slate-400 text-sm mb-4">Cell structure identification and analysis</p>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">{12 + i} students completed</span>
                                    <span className="text-cyan-400 font-medium">View →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default TeacherDashboard;
