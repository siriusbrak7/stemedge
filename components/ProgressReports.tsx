
import React, { useState, useEffect } from 'react';
import { Classroom, Assignment, TopicMastery, StudentMetric } from '../types';
import { teacherDataService } from '../services/teacherDataService';
import { assignmentService } from '../services/assignmentService';
import { reportService } from '../services/reportService';
import { 
    BarChart2, Users, Grid, Download, ChevronDown, 
    Search, Filter, CheckCircle, XCircle, AlertTriangle 
} from 'lucide-react';
import StudentDetailReport from './StudentDetailReport';

interface Props {
    user: { username: string };
}

const ProgressReports: React.FC<Props> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'mastery'>('overview');
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<StudentMetric | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
    
    // Data States
    const [assignmentMatrix, setAssignmentMatrix] = useState<any[]>([]);
    const [topicMastery, setTopicMastery] = useState<TopicMastery[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const classList = teacherDataService.getClasses(user.username);
        setClasses(classList);
        if (classList.length > 0) {
            setSelectedClassId(classList[0].id);
        }
    }, [user.username]);

    // Fetch dependent data when selection changes
    useEffect(() => {
        if (!selectedClassId) return;

        // Assignments
        assignmentService.getAssignmentsForTeacher(user.username).then(allAsgs => {
            const asgs = allAsgs.filter(a => a.classIds.includes(selectedClassId));
            setAssignments(asgs);
            if (asgs.length > 0 && !selectedAssignmentId) setSelectedAssignmentId(asgs[0].id);
        });

        // Topic Mastery (Mock Data)
        setTopicMastery(reportService.getTopicMastery(selectedClassId));

    }, [selectedClassId, user.username]);

    useEffect(() => {
        if (selectedClassId && selectedAssignmentId) {
            reportService.getAssignmentMatrix(selectedClassId, selectedAssignmentId).then(matrix => {
                setAssignmentMatrix(matrix);
            });
        }
    }, [selectedClassId, selectedAssignmentId]);

    const selectedClass = classes.find(c => c.id === selectedClassId);
    
    // Filtered students for overview
    const filteredStudents = selectedClass?.students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (selectedStudent) {
        return <StudentDetailReport student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select 
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="appearance-none bg-slate-900 border border-slate-700 text-white py-2 pl-4 pr-10 rounded-lg font-bold focus:outline-none focus:border-purple-500"
                        >
                            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Overview
                        </button>
                        <button 
                            onClick={() => setActiveTab('assignments')}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'assignments' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Assignments
                        </button>
                        <button 
                            onClick={() => setActiveTab('mastery')}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === 'mastery' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Topics
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {activeTab === 'overview' && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Filter students..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 w-48"
                            />
                        </div>
                    )}
                    <button 
                        onClick={() => {
                            if (activeTab === 'assignments') reportService.downloadCSV(assignmentMatrix, 'assignment_report.csv');
                            else if (activeTab === 'overview') reportService.downloadCSV(filteredStudents, 'class_roster.csv');
                            else alert("Export coming soon for this view");
                        }}
                        className="p-2 text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Export CSV"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* --- VIEW: CLASS OVERVIEW --- */}
            {activeTab === 'overview' && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase font-bold text-xs">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Overall Progress</th>
                                <th className="px-6 py-4">Avg Score</th>
                                <th className="px-6 py-4">Risk Level</th>
                                <th className="px-6 py-4">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr 
                                        key={student.id} 
                                        onClick={() => setSelectedStudent(student)}
                                        className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4 font-medium text-white group-hover:text-purple-400 transition-colors">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-cyan-500" style={{ width: `${student.overallProgress}%` }} />
                                                </div>
                                                <span className="text-slate-400 text-xs">{student.overallProgress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-mono font-bold ${student.averageScore < 70 ? 'text-red-400' : 'text-green-400'}`}>
                                                {student.averageScore}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.atRisk ? (
                                                <span className="inline-flex items-center gap-1 text-red-400 bg-red-900/20 px-2 py-0.5 rounded text-xs font-bold border border-red-500/20">
                                                    <AlertTriangle className="w-3 h-3" /> High Risk
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-green-400 bg-green-900/20 px-2 py-0.5 rounded text-xs font-bold border border-green-500/20">
                                                    <CheckCircle className="w-3 h-3" /> On Track
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(student.lastActive).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- VIEW: ASSIGNMENT MATRIX --- */}
            {activeTab === 'assignments' && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <label className="text-sm text-slate-400 font-bold uppercase">Assignment:</label>
                        <div className="relative">
                            <select 
                                value={selectedAssignmentId}
                                onChange={(e) => setSelectedAssignmentId(e.target.value)}
                                className="appearance-none bg-slate-800 border border-slate-700 text-white py-1.5 pl-3 pr-8 rounded text-sm focus:outline-none focus:border-purple-500"
                            >
                                {assignments.length === 0 && <option value="">No Assignments</option>}
                                {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                        </div>
                    </div>

                    {assignments.length > 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 uppercase font-bold text-xs">
                                    <tr>
                                        {assignmentMatrix.length > 0 && Object.keys(assignmentMatrix[0]).map((header, i) => (
                                            <th key={i} className={`px-6 py-4 ${i === 0 ? 'sticky left-0 bg-slate-950 z-10' : ''}`}>
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {assignmentMatrix.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                                            {Object.keys(row).map((key, j) => {
                                                const val = row[key];
                                                // Formatting logic
                                                let cellContent = <span className="text-slate-400">{val}</span>;
                                                
                                                if (val === 'Completed') {
                                                    cellContent = <span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Done</span>;
                                                } else if (val === 'Not Started') {
                                                    cellContent = <span className="text-slate-600 italic">--</span>;
                                                } else if (typeof val === 'string' && val.includes('%')) {
                                                    const score = parseInt(val);
                                                    cellContent = (
                                                        <span className={`font-mono font-bold ${score < 70 ? 'text-red-400' : 'text-green-400'}`}>
                                                            {val}
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <td key={j} className={`px-6 py-4 ${j === 0 ? 'sticky left-0 bg-slate-900 z-10 font-bold text-white border-r border-slate-800' : ''}`}>
                                                        {cellContent}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl">
                            <p className="text-slate-500">No assignments found for this class.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- VIEW: TOPIC MASTERY --- */}
            {activeTab === 'mastery' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topicMastery.map((topic) => (
                        <div 
                            key={topic.topicId} 
                            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-white text-lg">{topic.topicName}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${
                                    topic.masteryLevel === 'mastered' ? 'bg-green-900/20 text-green-400 border-green-500/20' : 
                                    topic.masteryLevel === 'developing' ? 'bg-amber-900/20 text-amber-400 border-amber-500/20' : 
                                    'bg-red-900/20 text-red-400 border-red-500/20'
                                }`}>
                                    {topic.masteryLevel}
                                </span>
                            </div>
                            
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-bold text-white">{topic.averageScore}%</span>
                                <span className="text-slate-500 text-sm mb-1">Class Avg</span>
                            </div>

                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                                <div 
                                    className={`h-full ${
                                        topic.averageScore >= 85 ? 'bg-green-500' : 
                                        topic.averageScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
                                    }`} 
                                    style={{ width: `${topic.averageScore}%` }} 
                                />
                            </div>

                            <div className="flex justify-between text-xs text-slate-500">
                                <span>{topic.studentCount} students attempted</span>
                                <button className="text-cyan-400 hover:underline">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default ProgressReports;
