import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, RefreshCw, Users, Clock, Search } from 'lucide-react';

interface Teacher {
    id: string;
    username: string;
    email: string;
    created_at: string;
    isApproved: boolean;
}

const AdminDashboard: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchTeachers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'teacher');
        if (!error && data) setTeachers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const approveTeacher = async (id: string) => {
        await supabase.from('users').update({ isApproved: true }).eq('id', id);
        fetchTeachers();
    };

    const rejectTeacher = async (id: string) => {
        if (confirm('Delete this teacher account?')) {
            await supabase.from('users').delete().eq('id', id);
            fetchTeachers();
        }
    };

    const pending = teachers.filter(t => !t.isApproved);
    const approved = teachers.filter(t => t.isApproved);

    const filteredPending = pending.filter(t => 
        t.username.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredApproved = approved.filter(t => 
        t.username.toLowerCase().includes(search.toLowerCase()) ||
        t.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <button 
                    onClick={fetchTeachers}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <p className="text-slate-400 text-sm">Total Teachers</p>
                    <p className="text-3xl font-bold text-white">{teachers.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <p className="text-slate-400 text-sm">Pending Approval</p>
                    <p className="text-3xl font-bold text-amber-400">{pending.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <p className="text-slate-400 text-sm">Approved</p>
                    <p className="text-3xl font-bold text-green-400">{approved.length}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search teachers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
            </div>

            {/* Pending Teachers */}
            {filteredPending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-400" />
                        Pending Approval ({filteredPending.length})
                    </h2>
                    <div className="space-y-3">
                        {filteredPending.map(teacher => (
                            <div key={teacher.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{teacher.username}</p>
                                    <p className="text-sm text-slate-400">{teacher.email}</p>
                                    <p className="text-xs text-slate-500">Joined: {new Date(teacher.created_at).toLocaleDateString()}</p>
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
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Approved Teachers ({filteredApproved.length})
                    </h2>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-950/50 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Email</th>
                                    <th className="px-6 py-4 text-slate-400 text-sm font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredApproved.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td className="px-6 py-4 text-white">{teacher.username}</td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(teacher.created_at).toLocaleDateString()}
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
