import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DashboardData, Assignment, StudentAssignmentProgress, VirtualLab, Badge, UserBadge, UserStreak } from '../types';
import { studentDataService } from '../services/studentDataService';
import { assignmentService } from '../services/assignmentService';
import { gamificationService } from '../services/gamificationService'; 
import { 
    Dna, Microscope, Leaf, Activity, 
    Clock, WifiOff, ArrowRight, Zap, Star,
    ClipboardList, Calendar, CheckCircle, FlaskConical, Trophy
} from 'lucide-react';
import TutorSidebar from './TutorSidebar';
import VirtualLabsList from './VirtualLabsList';
import StreakCounter from './gamification/StreakCounter'; 
import AchievementsSection from './gamification/AchievementsSection'; 
import BadgeNotification from './gamification/BadgeNotification'; 

interface Props {
    user: User;
}

const StudentDashboard: React.FC<Props> = ({ user }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [assignments, setAssignments] = useState<{ assignment: Assignment, progress: StudentAssignmentProgress }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    
    // Gamification State
    const [streak, setStreak] = useState<UserStreak | null>(null);
    const [allBadges, setAllBadges] = useState<Badge[]>([]);
    const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
    const [newBadge, setNewBadge] = useState<Badge | null>(null);

    // UI States
    const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);

    // Initial Data Fetch
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            // Use user.id for service calls (UUID), but display name uses username
            const dashboardData = await studentDataService.getDashboardData(user.id);
            const asgData = await assignmentService.getStudentAssignments(user.id);
            
            const currentStreak = gamificationService.updateStreak(user.id);
            const badges = gamificationService.getAllBadges();
            const earned = gamificationService.getUserBadges(user.id);

            if (isMounted) {
                setData(dashboardData);
                setAssignments(asgData);
                setStreak(currentStreak);
                setAllBadges(badges);
                setUserBadges(earned);
                setLoading(false);
                checkBadges();
            }
        };

        fetchData();

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            isMounted = false;
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [user.id]); 

    const checkBadges = async () => {
        const earned = await gamificationService.checkForNewBadges(user.id);
        if (earned.length > 0) {
            setUserBadges(gamificationService.getUserBadges(user.id)); 
            setNewBadge(earned[0]); 
        }
    };

    const handleAssignmentItemClick = (assignmentId: string, item: { id: string, type: 'lesson' | 'quiz', contentId: string }) => {
        assignmentService.updateStudentProgress(user.id, assignmentId, item.id, false); 
        if (item.type === 'lesson') {
            navigate(`/lesson/${item.contentId}`);
        } else {
            navigate(`/quiz/${item.contentId.replace('quiz_', '')}`);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                    <p className="text-slate-400 animate-pulse">Synchronizing with Starbase...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // --- LOGIC ---
    const getProgress = (topicId: string) => data.progress[topicId];
    const allCompleted = data.topics.every(t => getProgress(t.id)?.isCompleted);
    const featuredTopic = data.topics.find(t => {
        const p = getProgress(t.id);
        return !p || !p.isCompleted;
    }) || data.topics[0];

    const displayName = user.username ? user.username.split('@')[0] : 'Explorer';

    const IconRenderer = ({ name, className = "w-6 h-6" }: { name: string, className?: string }) => {
        switch(name) {
            case 'dna': return <Dna className={`${className} text-purple-400`} />;
            case 'microscope': return <Microscope className={`${className} text-cyan-400`} />;
            case 'leaf': return <Leaf className={`${className} text-green-400`} />;
            case 'activity': return <Activity className={`${className} text-red-400`} />;
            case 'trophy': return <Trophy className={`${className} text-amber-400`} />;
            case 'star': return <Star className={`${className} text-yellow-400`} />;
            case 'zap': return <Zap className={`${className} text-blue-400`} />;
            default: return <Activity className={`${className} text-slate-400`} />;
        }
    };

    return (
        <div id="dashboard-container" className="max-w-6xl mx-auto">
            
            <div id="nova-trigger">
                <TutorSidebar user={user} />
            </div>
            
            <BadgeNotification badge={newBadge} onClose={() => setNewBadge(null)} />

            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">{displayName}</span>
                    </h1>
                    <p className="text-slate-400">
                        {allCompleted 
                            ? "Mission Accomplished! You have mastered the available curriculum." 
                            : "Your learning journey continues. Ready to explore?"}
                    </p>
                </div>
                <div id="streak-counter" className="flex items-center gap-4">
                    {isOffline && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-900/30 border border-amber-600/30 rounded-full text-amber-500 text-xs font-bold uppercase tracking-wider">
                            <WifiOff className="w-3 h-3" />
                            Offline
                        </div>
                    )}
                    <StreakCounter streak={streak} />
                </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div id="achievements">
                <AchievementsSection badges={allBadges} userBadges={userBadges} />
            </div>

            {/* FEATURED MODULE */}
            <section id="featured" className="mb-12 animate-fade-in-up">
                <div 
                    onClick={() => navigate(`/lesson/${featuredTopic.id}`)}
                    className="group relative bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-2xl p-0 overflow-hidden cursor-pointer transition-all hover:scale-[1.01] shadow-xl"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-0 group-hover:bg-cyan-500/20 transition-colors" />
                    
                    <div className="grid md:grid-cols-2">
                        <div className="p-8 relative z-10 flex flex-col justify-center">
                            <span className="text-cyan-400 font-bold tracking-wider text-xs uppercase mb-2">
                                {featuredTopic.id === 'cell_biology' ? 'Interactive Lesson' : 'Next Up'}
                            </span>
                            <h3 className="text-3xl font-bold text-white mb-4">{featuredTopic.title}</h3>
                            <p className="text-slate-400 mb-6 leading-relaxed">
                                {featuredTopic.description}
                            </p>
                            <div className="flex items-center gap-6 mb-8 text-sm text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> ~45 mins</span>
                                <span>{featuredTopic.totalLessons} Lessons</span>
                                <span className="capitalize">{featuredTopic.difficulty}</span>
                            </div>
                            <button className="w-fit px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors">
                                Start Expedition <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="relative h-64 md:h-auto bg-slate-950/50 flex items-center justify-center p-8">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-[40%] animate-spin-slow"></div>
                                <div className="absolute inset-4 border-4 border-purple-500/30 rounded-full animate-reverse-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <IconRenderer name={featuredTopic.iconName} className="w-16 h-16 opacity-80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TEACHER ASSIGNMENTS */}
            {assignments.length > 0 && (
                <section className="mb-12 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-6">
                        <ClipboardList className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-bold text-white tracking-wide">Teacher Assignments</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {assignments.map(({ assignment, progress }) => {
                            const isExpanded = expandedAssignmentId === assignment.id;
                            const isOverdue = progress.status === 'overdue';
                            const isComplete = progress.status === 'completed';
                            
                            return (
                                <div 
                                    key={assignment.id} 
                                    className={`relative bg-slate-900 border rounded-2xl transition-all ${
                                        isOverdue ? 'border-red-900/50' : 
                                        isComplete ? 'border-green-900/50' : 
                                        'border-slate-800 hover:border-purple-500/30'
                                    } ${isExpanded ? 'md:col-span-2' : ''}`}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-white text-lg mb-1">{assignment.title}</h3>
                                                <p className="text-xs text-slate-400 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">{assignment.instructions}</p>

                                        {isExpanded ? (
                                            <div className="space-y-3 border-t border-slate-800 pt-4 animate-fade-in">
                                                {assignment.items.map((item, idx) => {
                                                    const isItemComplete = progress.completedItemIds.includes(item.id);
                                                    return (
                                                        <div 
                                                            key={item.id} 
                                                            onClick={() => !isItemComplete && handleAssignmentItemClick(assignment.id, item)}
                                                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                                                isItemComplete 
                                                                    ? 'bg-green-900/10 border-green-500/20 cursor-default' 
                                                                    : 'bg-slate-800 border-slate-700 hover:border-purple-500/50 cursor-pointer'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                                                    isItemComplete ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'
                                                                }`}>
                                                                    {isItemComplete ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                                                                </div>
                                                                <span className={isItemComplete ? 'text-slate-400 line-through' : 'text-white'}>
                                                                    {item.title}
                                                                </span>
                                                            </div>
                                                            {!isItemComplete && <ArrowRight className="w-4 h-4 text-purple-400" />}
                                                        </div>
                                                    );
                                                })}
                                                <button 
                                                    onClick={() => setExpandedAssignmentId(null)}
                                                    className="w-full py-2 text-center text-sm text-slate-500 hover:text-white mt-2"
                                                >
                                                    Collapse Details
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setExpandedAssignmentId(assignment.id)}
                                                className={`w-full py-2 rounded-lg font-bold transition-colors ${
                                                    isComplete 
                                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                                }`}
                                            >
                                                {isComplete ? 'Review Work' : 'Continue Assignment'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* CURRICULUM */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-3" id="curriculum">
                    <div className="flex items-center gap-2 mb-6">
                        <Dna className="w-5 h-5 text-purple-400" />
                        <h2 className="text-xl font-bold text-white tracking-wide">Curriculum</h2>
                    </div>

                    <div className="space-y-4">
                        {data.topics.map(topic => {
                            const prog = getProgress(topic.id);
                            const isStarted = !!prog;
                            const isDone = prog?.isCompleted;
                            const percent = isStarted ? Math.round((prog.completedLessons / topic.totalLessons) * 100) : 0;

                            return (
                                <div key={topic.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className={`p-3 rounded-lg border w-fit ${
                                        isDone ? 'bg-green-900/20 border-green-500/30' : 
                                        isStarted ? 'bg-cyan-900/20 border-cyan-500/30' : 
                                        'bg-slate-800 border-slate-700'
                                    }`}>
                                        <IconRenderer name={topic.iconName} />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className={`font-bold ${isDone ? 'text-green-400' : 'text-white'}`}>{topic.title}</h3>
                                            <span className="text-xs text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{topic.difficulty}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mb-3">{topic.description}</p>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${
                                                        isDone ? 'bg-green-500' : 'bg-cyan-500'
                                                    }`} 
                                                    style={{ width: `${percent}%` }} 
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-slate-500 w-8 text-right">{percent}%</span>
                                        </div>
                                    </div>

                                    <div className="sm:border-l border-slate-800 sm:pl-4 flex sm:flex-col items-center justify-between sm:justify-center gap-2 min-w-[100px]">
                                        {isDone ? (
                                            <>
                                                <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> Mastered
                                                </span>
                                                <button 
                                                    onClick={() => navigate(`/quiz/${topic.id}`)}
                                                    className="text-xs text-cyan-400 hover:text-white mt-1 hover:underline"
                                                >
                                                    Practice Again
                                                </button>
                                            </>
                                        ) : (
                                            <button 
                                                onClick={() => navigate(`/lesson/${topic.id}`)}
                                                className="text-xs bg-slate-800 text-white border border-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-700 w-full transition-colors"
                                            >
                                                {isStarted ? 'Resume' : 'Start'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* VIRTUAL LABS */}
            <section id="labs" className="mb-12 animate-fade-in-up">
                <div className="flex items-center gap-2 mb-6">
                    <FlaskConical className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white tracking-wide">Virtual Labs</h2>
                </div>
                <VirtualLabsList 
                    studentId={user.id}
                    onStartLab={(lab) => navigate(`/lab/${lab.id}`)} 
                />
            </section>

        </div>
    );
};

export default StudentDashboard;
