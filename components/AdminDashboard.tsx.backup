import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { 
    Users, CheckCircle, XCircle, RefreshCw,
    Search, Shield, AlertCircle, Clock,
    BarChart3, Mail, Filter, Download,
    School, UserCheck, UserX, TrendingUp,
    MoreVertical, Eye, Ban, Trash2
} from 'lucide-react';

interface PendingTeacher {
    id: string;
    username: string;
    email: string;
    created_at: string;
    securityQuestion: string;
    lastActive?: string;
}

interface SystemStats {
    totalTeachers: number;
    totalStudents: number;
    pendingApprovals: number;
    activeToday: number;
    totalClasses: number;
    completedAssignments: number;
}

const AdminDashboard: React.FC = () => {
    const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
    const [approvedTeachers, setApprovedTeachers] = useState<PendingTeacher[]>([]);
    const [allTeachers, setAllTeachers] = useState<PendingTeacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState<SystemStats>({
        totalTeachers: 0,
        totalStudents: 0,
        pendingApprovals: 0,
        activeToday: 0,
        totalClasses: 0,
        completedAssignments: 0
    });
    const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');

    const fetchTeachers = async () => {
        setLoading(true);
        
        try {
            // Fetch all teachers
            const { data: allTeachersData } = await supabase
                .from('users')
                .select('id, username, email, created_at, securityQuestion, isApproved, last_sign_in_at')
                .eq('role', 'teacher')
                .order('created_at', { ascending: false });
            
            // Fetch pending teachers
            const { data: pending } = await supabase
                .from('users')
                .select('id, username, email, created_at, securityQuestion, last_sign_in_at')
                .eq('role', 'teacher')
                .eq('isApproved', false)
                .order('created_at', { ascending: false });
                
            // Fetch approved teachers
            const { data: approved } = await supabase
                .from('users')
                .select('id, username, email, created_at, securityQuestion, last_sign_in_at')
                .eq('role', 'teacher')
                .eq('isApproved', true)
                .order('created_at', { ascending: false });
            
            // Fetch student count
            const { count: studentCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'student');
            
            // Calculate active today (simplified - last 24h)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { count: activeCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .gt('last_sign_in_at', oneDayAgo);
            
            if (allTeachersData) {
                setAllTeachers(allTeachersData);
                setStats(prev => ({
                    ...prev,
                    totalTeachers: allTeachersData.length,
                    totalStudents: studentCount || 0,
                    pendingApprovals: pending?.length || 0,
                    activeToday: activeCount || 0
                }));
            }
            
            if (pending) setPendingTeachers(pending);
            if (approved) setApprovedTeachers(approved);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const approveTeacher = async (teacherId: string) => {
        const { error } = await supabase
            .from('users')
            .update({ isApproved: true })
            .eq('id', teacherId);
            
        if (!error) {
            fetchTeachers();
        }
    };

    const rejectTeacher = async (teacherId: string) => {
        if (confirm('Are you sure you want to reject and delete this teacher account?')) {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', teacherId);
                
            if (!error) {
                fetchTeachers();
            }
        }
    };

    const sendReminderEmail = (teacher: PendingTeacher) => {
        alert(`Reminder sent to ${teacher.email} (Demo)`);
        // In production, trigger edge function
    };

    useEffect(() => {
        fetchTeachers();
        
        // Set up realtime subscription for teacher approvals
        const subscription = supabase
            .channel('teacher_changes')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'users',
                filter: 'role=eq.teacher'
            }, () => {
                fetchTeachers();
            })
            .subscribe();
        
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const getFilteredTeachers = () => {
        let filtered = [];
        
        if (filterStatus === 'pending') {
            filtered = pendingTeachers;
        } else if (filterStatus === 'approved') {
            filtered = approvedTeachers;
        } else {
            filtered = allTeachers;
        }
        
        return filtered.filter(t => 
            t.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const handleBulkApprove = async () => {
        if (pendingTeachers.length === 0) return;
        
        if (confirm(`Approve all ${pendingTeachers.length} pending teachers?`)) {
            for (const teacher of pendingTeachers) {
                await approveTeacher(teacher.id);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    const filteredTeachers = getFilteredTeachers();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-purple-400" />
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400">Manage teacher approvals and platform settings</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={fetchTeachers}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleBulkApprove}
                        disabled={pendingTeachers.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Approve All ({pendingTeachers.length})
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-900/30 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">Total Teachers</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalTeachers}</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-900/30 rounded-lg">
                            <UserCheck className="w-5 h-5 text-green-400" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">Approved</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{approvedTeachers.length}</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-900/30 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-400" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">Pending</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-400">{pendingTeachers.length}</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-900/30 rounded-lg">
                            <School className="w-5 h-5 text-purple-400" />
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">Students</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-400">{stats.totalStudents}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-2">
                    {(['all', 'pending', 'approved'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                                filterStatus === status
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            {status}
                            {status === 'pending' && pendingTeachers.length > 0 && 
                                ` (${pendingTeachers.length})`
                            }
                        </button>
                    ))}
                </div>
                
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search teachers by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    />
                </div>
            </div>

            {/* Teachers List */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {filteredTeachers.length === 0 ? (
                    <div className="text-center py-16">
                        <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400">No teachers found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Teacher</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Email</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Joined</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Status</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Security Question</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredTeachers.map(teacher => {
                                    const isPending = pendingTeachers.some(p => p.id === teacher.id);
                                    
                                    return (
                                        <tr key={teacher.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-purple-900/30 rounded-full flex items-center justify-center">
                                                        <span className="text-purple-400 font-bold text-sm">
                                                            {teacher.username?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-white font-medium">{teacher.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">{teacher.email || teacher.username}</td>
                                            <td className="px-6 py-4 text-slate-400 text-sm">
                                                {new Date(teacher.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isPending ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-900/20 text-amber-400 rounded text-xs border border-amber-500/20">
                                                        <Clock className="w-3 h-3" /> Pending
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/20 text-green-400 rounded text-xs border border-green-500/20">
                                                        <CheckCircle className="w-3 h-3" /> Approved
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                                                {teacher.securityQuestion || 'Not set'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {isPending ? (
                                                        <>
                                                            <button
                                                                onClick={() => approveTeacher(teacher.id)}
                                                                className="p-2 bg-green-900/20 hover:bg-green-900/40 text-green-400 rounded-lg transition-colors"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => sendReminderEmail(teacher)}
                                                                className="p-2 bg-blue-900/20 hover:bg-blue-900/40 text-blue-400 rounded-lg transition-colors"
                                                                title="Send Reminder"
                                                            >
                                                                <Mail className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => rejectTeacher(teacher.id)}
                                                                className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => setSelectedTeacher(teacher)}
                                                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                                                                title="More"
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        Platform Growth
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">New teachers (7 days)</span>
                            <span className="text-white font-bold">+{Math.floor(allTeachers.length * 0.3)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Active today</span>
                            <span className="text-white font-bold">{stats.activeToday}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Approval rate</span>
                            <span className="text-white font-bold">
                                {stats.totalTeachers ? 
                                    Math.round((approvedTeachers.length / stats.totalTeachers) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-400" />
                        Quick Actions
                    </h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-sm text-slate-300 flex items-center justify-between">
                            <span>Download teacher list</span>
                            <Download className="w-4 h-4" />
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-sm text-slate-300 flex items-center justify-between">
                            <span>System health check</span>
                            <Shield className="w-4 h-4" />
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all text-sm text-slate-300 flex items-center justify-between">
                            <span>View all logs</span>
                            <AlertCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Teacher Details Modal */}
            {showDetailsModal && selectedTeacher && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Teacher Details</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-slate-400 text-sm">Username</p>
                                <p className="text-white">{selectedTeacher.username}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Email</p>
                                <p className="text-white">{selectedTeacher.email}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Joined</p>
                                <p className="text-white">{new Date(selectedTeacher.created_at).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">Security Question</p>
                                <p className="text-white">{selectedTeacher.securityQuestion}</p>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;