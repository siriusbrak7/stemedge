import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import { 
    Users, CheckCircle, XCircle, RefreshCw,
    Search, Shield, AlertCircle
} from 'lucide-react';

interface PendingTeacher {
    id: string;
    username: string;
    created_at: string;
    securityQuestion: string;
}

const AdminDashboard: React.FC = () => {
    const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
    const [approvedTeachers, setApprovedTeachers] = useState<PendingTeacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTeachers = async () => {
        setLoading(true);
        
        // Fetch pending teachers
        const { data: pending } = await supabase
            .from('users')
            .select('id, username, created_at, securityQuestion')
            .eq('role', 'teacher')
            .eq('isApproved', false)
            .order('created_at', { ascending: false });
            
        // Fetch approved teachers
        const { data: approved } = await supabase
            .from('users')
            .select('id, username, created_at, securityQuestion')
            .eq('role', 'teacher')
            .eq('isApproved', true)
            .order('created_at', { ascending: false });
            
        if (pending) setPendingTeachers(pending);
        if (approved) setApprovedTeachers(approved);
        setLoading(false);
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
        // Optional: Delete or just keep as unapproved
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', teacherId);
            
        if (!error) {
            fetchTeachers();
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredPending = pendingTeachers.filter(t => 
        t.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApproved = approvedTeachers.filter(t => 
        t.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-400">Manage teacher approvals and platform settings</p>
                </div>
                <button 
                    onClick={fetchTeachers}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-medium text-white">Total Teachers</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{approvedTeachers.length + pendingTeachers.length}</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <h3 className="text-lg font-medium text-white">Pending Approval</h3>
                    </div>
                    <p className="text-3xl font-bold text-amber-400">{pendingTeachers.length}</p>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-medium text-white">Approved</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-400">{approvedTeachers.length}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search teachers by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                />
            </div>

            {/* Pending Teachers */}
            {filteredPending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        Pending Approval ({filteredPending.length})
                    </h2>
                    
                    <div className="space-y-3">
                        {filteredPending.map(teacher => (
                            <div key={teacher.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{teacher.username}</p>
                                    <p className="text-sm text-slate-500">
                                        Joined: {new Date(teacher.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-slate-600 mt-1">
                                        Security Q: {teacher.securityQuestion}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => approveTeacher(teacher.id)}
                                        className="p-2 bg-green-900/20 hover:bg-green-900/40 text-green-400 rounded-lg transition-colors"
                                        title="Approve"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => rejectTeacher(teacher.id)}
                                        className="p-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg transition-colors"
                                        title="Reject"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Approved Teachers */}
            {filteredApproved.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Approved Teachers ({filteredApproved.length})
                    </h2>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Email</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Joined</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredApproved.map(teacher => (
                                    <tr key={teacher.id} className="hover:bg-slate-800/50">
                                        <td className="px-6 py-4 text-white">{teacher.username}</td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(teacher.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-900/20 text-green-400 rounded text-xs border border-green-500/20">
                                                <CheckCircle className="w-3 h-3" /> Approved
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {filteredPending.length === 0 && filteredApproved.length === 0 && (
                <div className="text-center py-12 bg-slate-900 rounded-2xl border border-dashed border-slate-800">
                    <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400">No teachers found</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;