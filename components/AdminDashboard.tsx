import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, XCircle, RefreshCw, Users, Clock } from 'lucide-react';

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
        if (confirm('Delete teacher?')) {
            await supabase.from('users').delete().eq('id', id);
            fetchTeachers();
        }
    };

    const pending = teachers.filter(t => !t.isApproved);
    const approved = teachers.filter(t => t.isApproved);

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400">Pending</p>
                    <p className="text-3xl font-bold text-amber-400">{pending.length}</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-xl">
                    <p className="text-slate-400">Approved</p>
                    <p className="text-3xl font-bold text-green-400">{approved.length}</p>
                </div>
            </div>

            {pending.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-white mb-4">Pending Approval</h2>
                    {pending.map(t => (
                        <div key={t.id} className="bg-slate-900 p-4 rounded-xl mb-2 flex justify-between items-center">
                            <div>
                                <p className="text-white">{t.username}</p>
                                <p className="text-sm text-slate-400">Joined: {new Date(t.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => approveTeacher(t.id)} className="p-2 bg-green-600 rounded-lg"><CheckCircle size={18} /></button>
                                <button onClick={() => rejectTeacher(t.id)} className="p-2 bg-red-600 rounded-lg"><XCircle size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {approved.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Approved Teachers</h2>
                    {approved.map(t => (
                        <div key={t.id} className="bg-slate-900 p-4 rounded-xl mb-2">
                            <p className="text-white">{t.username}</p>
                            <p className="text-sm text-slate-400">Approved</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
