import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Microscope, 
  Zap, 
  Beaker, 
  Calculator, 
  ChevronRight, 
  BookOpen, 
  BrainCircuit, 
  CheckCircle,
  ArrowLeft,
  Trophy,
  Clock,
  Activity,
  Gamepad2,
  ArrowRight,
  Layers3,
  Loader2,
} from 'lucide-react';
import { Subject, Topic } from './data/mockData';
import LessonComponent from './components/LessonComponent';
import FlashcardComponent from './components/FlashcardComponent';
import QuizEngine from './components/QuizEngine';
import LabLauncher from './components/labs/LabLauncher';
import { supabase } from './services/supabaseClient';
import { useAuth } from './contexts/AuthContext';
import { VIRTUAL_LABS } from './data/virtualLabs';
import LearningStatsPanel from './components/LearningStatsPanel';
import StudentDashboard from './components/dashboard/StudentDashboard';
import {
  buildResumeData,
  calculateStreakDays,
  getCompletedCount,
  type ProgressRecord,
  type ResumeData,
} from './utils/learningMetrics';

type ViewState = 'subject-select' | 'topic-select' | 'learning-flow' | 'final-assessment' | 'topic-complete' | 'virtual-labs' | 'lab-active' | 'student-dashboard';
type LearningTab = 'lesson' | 'flashcards' | 'quiz';

export default function App() {
  const { user, signOut } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [view, setView] = useState<ViewState>('subject-select');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentSubtopicIdx, setCurrentSubtopicIdx] = useState(0);
  const [learningTab, setLearningTab] = useState<LearningTab>('lesson');
  const [progressRecords, setProgressRecords] = useState<Record<string, ProgressRecord>>({});
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [learningSessionStartedAt, setLearningSessionStartedAt] = useState<number | null>(null);
  const [sessionNow, setSessionNow] = useState(() => Date.now());
  const currentSubtopic = selectedTopic?.subtopics[currentSubtopicIdx] ?? null;
  const hasFlashcards = (currentSubtopic?.flashcards.length ?? 0) > 0;
  const hasQuiz = (currentSubtopic?.checkpointAssessment.length ?? 0) > 0;
  const subtopicScores = useMemo(
    () => Object.fromEntries(
      Object.entries(progressRecords).map(([id, record]) => [id, (record as ProgressRecord).score]),
    ),
    [progressRecords],
  );
  const streakDays = useMemo(() => calculateStreakDays(progressRecords), [progressRecords]);
  const sessionDurationMs = learningSessionStartedAt ? sessionNow - learningSessionStartedAt : 0;

  useEffect(() => {
    let cancelled = false;

    const loadSubjects = async () => {
      const module = await import('./data/subjects');
      if (cancelled) return;
      setSubjects(module.SUBJECTS);
      setSubjectsLoading(false);
    };

    loadSubjects();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (learningTab === 'flashcards' && !hasFlashcards) {
      setLearningTab('lesson');
    }

    if (learningTab === 'quiz' && !hasQuiz) {
      setLearningTab('lesson');
    }
  }, [hasFlashcards, hasQuiz, learningTab]);

  useEffect(() => {
    if (!selectedTopic) {
      setLearningSessionStartedAt(null);
      return;
    }

    setLearningSessionStartedAt((existing) => existing ?? Date.now());
  }, [selectedTopic]);

  useEffect(() => {
    if (!learningSessionStartedAt) return;

    const interval = window.setInterval(() => setSessionNow(Date.now()), 30000);
    return () => window.clearInterval(interval);
  }, [learningSessionStartedAt]);

  // Persistence
  useEffect(() => {
    if (!user || subjectsLoading) return;
    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('progress')
          .select('subtopic_id, score, subject_id, topic_id, updated_at')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          const records: Record<string, ProgressRecord> = {};
          data.forEach(item => {
            records[item.subtopic_id] = {
              score: item.score,
              updatedAt: item.updated_at,
            };
          });
          setProgressRecords(records);

          // Find the most recently active topic to resume
          const latest = data[0];
          if (latest.subject_id && latest.topic_id) {
            const subject = subjects.find(s => s.id === latest.subject_id);
            const topic = subject?.topics.find(t => t.id === latest.topic_id);
            if (topic) {
              setResumeData(buildResumeData(subject, topic, records));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load progress', err);
      }
    };
    fetchProgress();
  }, [user, subjects, subjectsLoading]);

  const saveProgress = async (
    subtopicId: string,
    score: number,
    isComplete: boolean,
    updatedProgress: Record<string, ProgressRecord>,
  ) => {
    if (!user) return;
    try {
      const { error } = await supabase.from('progress').upsert({
        user_id: user.id,
        subtopic_id: subtopicId,
        subject_id: selectedSubject?.id,
        topic_id: selectedTopic?.id,
        score,
        completed: isComplete,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, subtopic_id' });
      if (error) throw error;
      
      // Update local resume data so the resume button stays up-to-date
      if (selectedSubject && selectedTopic) {
        setResumeData(buildResumeData(selectedSubject, selectedTopic, updatedProgress));
      }
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setView('topic-select');
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentSubtopicIdx(0);
    setLearningTab('lesson');
    setView('learning-flow');
  };

  // Navigate to any subtopic freely
  const handleSubtopicNav = (idx: number) => {
    setCurrentSubtopicIdx(idx);
    setLearningTab('lesson');
    setView('learning-flow');
  };

  const handleSubtopicQuizComplete = (score: number) => {
    const topic = selectedTopic!;
    const subtopic = topic.subtopics[currentSubtopicIdx];
    const nextProgress = {
      ...progressRecords,
      [subtopic.id]: {
        score,
        updatedAt: new Date().toISOString(),
      },
    };
    setProgressRecords(nextProgress);
    saveProgress(subtopic.id, score, true, nextProgress);

    // Check if all subtopics are completed
    const allComplete = topic.subtopics.every(sub => nextProgress[sub.id] !== undefined);
    if (allComplete) {
      setView('final-assessment');
    } else {
      // Move to next uncompleted subtopic
      const nextUncompleted = topic.subtopics.findIndex(sub => nextProgress[sub.id] === undefined);
      if (nextUncompleted >= 0) {
        setCurrentSubtopicIdx(nextUncompleted);
        setLearningTab('lesson');
      }
    }
  };

  const handleResume = () => {
    if (!resumeData) return;
    const subject = subjects.find(s => s.id === resumeData.subjectId);
    if (!subject) return;
    const topic = subject.topics.find(t => t.id === resumeData.topicId);
    if (!topic) return;
    
    setSelectedSubject(subject);
    setSelectedTopic(topic);
    setCurrentSubtopicIdx(resumeData.subtopicIdx);
    setLearningTab('lesson');
    setView('learning-flow');
  };

  const handleFinalAssessmentComplete = (score: number) => {
    setFinalScore(score);
    setView('topic-complete');
  };

  const resetToHome = () => {
    setView('subject-select');
    setSelectedSubject(null);
    setSelectedTopic(null);
    setFinalScore(null);
    setActiveLabId(null);
  };

  const goBack = () => {
    if (view === 'topic-select') setView('subject-select');
    else if (view === 'learning-flow') setView('topic-select');
    else if (view === 'final-assessment') setView('learning-flow');
    else if (view === 'virtual-labs') setView('subject-select');
    else if (view === 'student-dashboard') setView('subject-select');
    else if (view === 'lab-active') { setView('virtual-labs'); setActiveLabId(null); }
  };

  const openLab = (labId: string) => {
    setActiveLabId(labId);
    setView('lab-active');
  };

  const isLearning = view === 'learning-flow' || view === 'final-assessment';

  return (
    <div className="flex h-screen w-full bg-brand-bg text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Sidebar - Only visible in learning mode or topic select */}
      <AnimatePresence>
        {(isLearning || view === 'topic-select') && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 bg-brand-sidebar border-r border-brand-border flex flex-col p-6 hidden lg:flex"
          >
            <div className="flex items-center gap-3 mb-12">
              <div 
                onClick={resetToHome}
                className="w-10 h-10 bg-cyan-500/20 border border-brand-accent rounded-lg flex items-center justify-center cursor-pointer"
              >
                <div className="w-5 h-5 bg-brand-accent rounded-sm"></div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white italic">STEM<span className="text-brand-accent">Edge</span></span>
            </div>

            <nav className="space-y-8 flex-1">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 block">Current Subject</label>
                <div 
                  onClick={goBack}
                  className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-brand-border cursor-pointer hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-medium text-sm">{selectedSubject?.name || 'Select Subject'}</span>
                  <ArrowLeft className="w-4 h-4 text-brand-accent" />
                </div>
              </div>

              {selectedTopic && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Module Progress</label>
                  <div className="space-y-3">
                    {selectedTopic.subtopics.map((sub, idx) => {
                      const isActive = idx === currentSubtopicIdx && view === 'learning-flow';
                      const isCompleted = subtopicScores[sub.id] !== undefined;
                      return (
                        <div 
                          key={sub.id}
                          onClick={() => handleSubtopicNav(idx)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer hover:bg-slate-800/50 ${
                            isActive 
                              ? 'bg-brand-accent/10 border border-brand-accent/30 ring-1 ring-brand-accent/20' 
                              : 'bg-transparent border border-transparent'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-brand-accent text-black' : 'border border-slate-600 text-slate-400'
                          }`}>
                            {isCompleted ? <CheckCircle size={12} /> : idx + 1}
                          </div>
                          <span className={`text-sm font-semibold truncate ${isActive ? 'text-white' : isCompleted ? 'text-slate-300' : 'text-slate-400'}`}>{sub.title}</span>
                          {isCompleted && subtopicScores[sub.id] !== undefined && (
                            <span className="ml-auto text-[10px] font-mono text-green-400">{Math.round(subtopicScores[sub.id] * 100)}%</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </nav>

            {selectedTopic && (
              <div className="mt-auto p-4 bg-gradient-to-br from-slate-900 to-black rounded-2xl border border-brand-border">
                <div className="text-xs text-slate-400 mb-2 italic">Topic Mastery</div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-accent shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-1000"
                    style={{ width: `${((getCompletedCount(selectedTopic, progressRecords) + (view === 'final-assessment' ? 0.5 : 0)) / (selectedTopic.subtopics.length + 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-brand-accent uppercase">
                  {getCompletedCount(selectedTopic, progressRecords)}/{selectedTopic.subtopics.length} Subtopics Completed
                </div>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header Bar */}
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-bg/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {view === 'subject-select' ? (
              <h1 
                onClick={resetToHome}
                className="text-2xl font-black tracking-tighter text-brand-accent flex items-center gap-2 cursor-pointer lg:hidden"
              >
                STEM<span className="text-white">Edge</span>
              </h1>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={goBack} className="p-2 hover:bg-slate-900 rounded-lg">
                  <ArrowLeft size={18} className="text-brand-accent" />
                </button>
                <div className="hidden sm:block">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                    {view === 'learning-flow' ? `Subtopic 0${currentSubtopicIdx + 1}` : 
                     view === 'virtual-labs' ? 'Virtual Labs' :
                     view === 'student-dashboard' ? 'Dashboard' :
                     view === 'lab-active' ? 'Lab Session' :
                     'Module Assessment'}
                  </span>
                  <h2 className="text-sm font-semibold text-white truncate max-w-[300px]">
                    {view === 'learning-flow' ? selectedTopic?.subtopics[currentSubtopicIdx].title : 
                     view === 'virtual-labs' ? 'Choose Your Experiment' :
                     view === 'student-dashboard' ? 'Student Progress' :
                     view === 'lab-active' ? VIRTUAL_LABS.find(l => l.id === activeLabId)?.title :
                     selectedTopic?.title}
                  </h2>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {view === 'subject-select' && (
              <>
                <button 
                  onClick={() => setView('student-dashboard')}
                  className="px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-slate-900 border border-brand-border text-slate-400 hover:text-white flex items-center gap-2"
                >
                  <Activity size={14} /> Dashboard
                </button>
                <button 
                  onClick={signOut}
                  className="px-4 py-1.5 rounded-full text-xs font-bold transition-all bg-slate-900 border border-brand-border text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </>
            )}
            {view === 'learning-flow' && (
              <>
                <button 
                  onClick={() => setLearningTab('lesson')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    learningTab === 'lesson' ? 'bg-brand-accent text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-900 border border-brand-border text-slate-400 hover:text-white'
                  }`}
                >
                  Lesson
                </button>
                <button 
                  onClick={() => setLearningTab('flashcards')}
                  disabled={!hasFlashcards}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    learningTab === 'flashcards' ? 'bg-brand-accent text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-900 border border-brand-border text-slate-400 hover:text-white'
                  }`}
                >
                  Cards
                </button>
                <button 
                  onClick={() => setLearningTab('quiz')}
                  disabled={!hasQuiz}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    learningTab === 'quiz' ? 'bg-brand-accent text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'bg-slate-900 border border-brand-border text-slate-400 hover:text-white'
                  }`}
                >
                  Quiz
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Viewport */}
        <section className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <AnimatePresence mode="wait">
            {view === 'subject-select' && (
              <motion.div
                key="subject-select"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-8 max-w-6xl mx-auto"
              >
                <div className="mb-16 mt-12 text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block p-2 px-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-6"
                  >
                    Interactive Learning Engine v1.0
                  </motion.div>
                  <h2 className="text-5xl sm:text-7xl font-light text-white mb-6 tracking-tight leading-none group">
                    Master the <span className="text-brand-accent italic font-medium">Frontiers</span> of Science
                  </h2>
                  <p className="text-slate-500 text-lg sm:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    Select a discipline to unlock advanced pedagogical modules, AI-powered assessments, and interactive visualizations.
                  </p>
                </div>

                {resumeData && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex justify-center"
                  >
                    <button
                      onClick={handleResume}
                      className="group flex items-center gap-4 bg-brand-accent/10 border border-brand-accent/30 px-6 py-4 rounded-3xl hover:bg-brand-accent/20 transition-all shadow-[0_0_20px_rgba(34,211,238,0.15)] active:scale-95"
                    >
                      <div className="p-2 bg-brand-accent/20 rounded-xl text-brand-accent">
                        <Activity size={20} />
                      </div>
                      <div className="text-left">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-0.5">Resume Learning</span>
                        <span className="block text-sm text-white font-medium">Continue where you left off</span>
                      </div>
                      <ChevronRight size={20} className="text-brand-accent/50 group-hover:text-brand-accent transition-colors ml-4" />
                    </button>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                  {subjectsLoading && (
                    <div className="md:col-span-2 flex items-center justify-center gap-3 rounded-[2rem] border border-brand-border bg-slate-900/40 p-10 text-slate-400">
                      <Loader2 className="w-5 h-5 animate-spin text-brand-accent" />
                      Loading curriculum...
                    </div>
                  )}
                  {subjects.map((subject) => {
                    const Icon = { Microscope, Zap, Beaker, Calculator }[subject.icon] || Microscope;
                    const isDisabled = subject.topics.length === 0;
                    return (
                      <button
                        key={subject.id}
                        disabled={isDisabled}
                        onClick={() => handleSubjectSelect(subject)}
                        className={`group relative flex flex-col p-8 rounded-[2.5rem] border transition-all text-left overflow-hidden ${
                          !isDisabled 
                            ? 'bg-slate-900 shadow-2xl border-slate-800 hover:border-brand-accent/50 hover:bg-slate-900/80 active:scale-[0.98]' 
                            : 'bg-black/20 border-slate-900 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {!isDisabled && (
                          <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/20 group-hover:bg-brand-accent/50 transition-colors"></div>
                        )}
                        <div className="flex items-center justify-between mb-12">
                          <div className={`p-5 rounded-2xl ${!isDisabled ? 'bg-black/40 text-brand-accent border border-brand-accent/10 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'bg-slate-900 text-slate-700'}`}>
                            <Icon size={32} strokeWidth={1.5} />
                          </div>
                          {!isDisabled && (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              Initialize Module <ChevronRight size={14} />
                            </div>
                          )}
                        </div>
                        <h3 className="text-3xl font-light text-white mb-2">{subject.name}</h3>
                        <p className="text-slate-500 text-sm font-medium tracking-wide">
                          {isDisabled ? 'Module expansion pending...' : `${subject.topics.length} Interactive Topics Synchronized`}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Virtual Labs Banner */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 mb-20"
                >
                  <button
                    onClick={() => setView('virtual-labs')}
                    className="w-full group relative p-8 rounded-[2.5rem] border border-green-500/20 bg-gradient-to-r from-green-500/5 via-cyan-500/5 to-purple-500/5 hover:border-green-500/40 hover:from-green-500/10 hover:via-cyan-500/10 hover:to-purple-500/10 transition-all text-left overflow-hidden shadow-2xl active:scale-[0.99]"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/30 via-cyan-500/30 to-purple-500/30 group-hover:from-green-500/60 group-hover:via-cyan-500/60 group-hover:to-purple-500/60 transition-colors"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                          <Gamepad2 size={32} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="text-3xl font-light text-white mb-2">Virtual <span className="text-green-400 font-medium italic">Labs</span></h3>
                          <p className="text-slate-500 text-sm font-medium tracking-wide">
                            {VIRTUAL_LABS.length} Gamified experiments across all subjects — predict, experiment, and score!
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {VIRTUAL_LABS.map(lab => (
                            <div key={lab.id} className="w-10 h-10 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-lg">
                              {lab.icon}
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-black rounded-2xl text-green-400 border border-green-500/20 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* Virtual Labs Selection */}
            {view === 'virtual-labs' && (
              <motion.div
                key="virtual-labs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 max-w-5xl mx-auto pt-8"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="w-12 h-px bg-green-500/50"></span>
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-[0.3em]">Gamified Experiments</span>
                </div>
                <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Virtual Labs</h2>
                <p className="text-slate-500 text-sm mb-10 max-w-lg">
                  Hands-on, gamified experiments where you predict outcomes, run simulations, and earn points. Each lab focuses on core concepts from its subject.
                </p>

                <div className="space-y-12 pb-20">
                  {['biology', 'physics', 'chemistry', 'mathematics'].map((subject) => {
                    const subjectLabs = VIRTUAL_LABS.filter(l => l.subject === subject);
                    if (subjectLabs.length === 0) return null;
                    return (
                      <div key={subject}>
                        <h3 className="text-xl font-light text-slate-300 mb-6 capitalize tracking-wide flex items-center gap-3">
                          <span className="w-8 h-px bg-slate-700"></span>
                          {subject} Labs
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {subjectLabs.map((lab, idx) => (
                            <motion.button
                              key={lab.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              onClick={() => openLab(lab.id)}
                              className="group relative bg-slate-900/40 border border-brand-border p-8 rounded-3xl text-left hover:border-green-500/40 transition-all shadow-xl overflow-hidden active:scale-[0.98]"
                            >
                              <div className="absolute top-0 left-0 w-full h-1 transition-colors" style={{ backgroundColor: `${lab.color}20` }}></div>

                              <div className="flex items-start justify-between mb-6">
                                <div className="text-4xl">{lab.icon}</div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ backgroundColor: `${lab.color}15`, color: lab.color }}>
                                    {lab.difficulty}
                                  </span>
                                </div>
                              </div>

                              <h3 className="text-xl font-medium text-white group-hover:text-green-400 transition-colors mb-2">{lab.title}</h3>
                              <p className="text-slate-500 text-sm leading-relaxed mb-4">{lab.description}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Clock size={12} className="text-slate-600" />
                                    <span className="text-[10px] text-slate-600 font-mono">{lab.timeEstimate}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{lab.subject}</span>
                                </div>
                                <div className="p-2 bg-black rounded-xl text-green-400 border border-green-500/20 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all">
                                  <ChevronRight size={16} />
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Active Lab */}
            {view === 'lab-active' && activeLabId && (
              <motion.div
                key="lab-active"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 max-w-6xl mx-auto"
              >
                <LabLauncher labId={activeLabId} />
              </motion.div>
            )}

            {/* Student Dashboard */}
            {view === 'student-dashboard' && (
              <StudentDashboard subjects={subjects} progress={progressRecords} />
            )}

            {view === 'topic-select' && selectedSubject && (
              <motion.div
                key="topic-select"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 max-w-3xl mx-auto pt-16"
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="w-12 h-px bg-brand-accent/50"></span>
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em]">{selectedSubject.name} Curriculum</span>
                </div>
                <h2 className="text-4xl font-light text-white mb-10 tracking-tight">Available Learning Modules</h2>
                <div className="space-y-4">
                  {selectedSubject.topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full group bg-slate-900/40 border border-brand-border p-8 rounded-3xl text-left flex items-center justify-between hover:border-brand-accent hover:bg-slate-900/60 transition-all shadow-xl"
                    >
                      <div>
                        <h3 className="text-2xl font-medium text-white group-hover:text-brand-accent transition-colors">{topic.title}</h3>
                        {topic.summary && (
                          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                            {topic.summary}
                          </p>
                        )}
                        <div className="flex items-center gap-6 mt-3">
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-brand-accent"></div>
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{topic.subtopics.length} SUB-MODULES</span>
                           </div>
                           {topic.levelBand && (
                             <div className="flex items-center gap-2">
                               <Layers3 size={12} className={topic.levelBand === 'advanced' ? 'text-amber-400' : 'text-emerald-400'} />
                               <span className={`text-[10px] font-bold uppercase tracking-widest ${topic.levelBand === 'advanced' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                 {topic.levelBand}
                               </span>
                             </div>
                           )}
                           {topic.curriculumTags && topic.curriculumTags.length > 0 && (
                             <span className="text-[10px] font-mono text-slate-600">{topic.curriculumTags.join(' · ')}</span>
                           )}
                           <span className="text-[10px] font-mono text-slate-600">ID: {topic.id.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="p-3 bg-black rounded-2xl text-brand-accent border border-brand-border group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {isLearning && selectedTopic && (
              <div className="grid grid-cols-12 gap-8 p-8 items-start max-w-7xl mx-auto h-full">
                {/* Main Interaction Area */}
                <div className="col-span-12 lg:col-span-8 flex flex-col h-full min-h-[600px]">
                  <AnimatePresence mode="wait">
                    {view === 'learning-flow' && learningTab === 'lesson' && (
                      <motion.div key="lesson" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <LessonComponent 
                           sections={currentSubtopic?.lesson.sections ?? []} 
                           subtopicId={currentSubtopic?.id} 
                        />
                      </motion.div>
                    )}
                    {view === 'learning-flow' && learningTab === 'flashcards' && (
                      <motion.div key="cards" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <FlashcardComponent flashcards={currentSubtopic?.flashcards ?? []} />
                      </motion.div>
                    )}
                    {(view === 'learning-flow' && learningTab === 'quiz') && (
                      <motion.div key="quiz" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                        <QuizEngine 
                          questions={currentSubtopic?.checkpointAssessment ?? []} 
                          onComplete={handleSubtopicQuizComplete}
                          subtopicId={currentSubtopic?.id}
                        />
                      </motion.div>
                    )}
                    {view === 'final-assessment' && (
                      <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                         <QuizEngine 
                            questions={selectedTopic.finalAssessment} 
                            onComplete={handleFinalAssessmentComplete}
                          />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Panel / Stats View */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 sticky top-0">
                  <LearningStatsPanel
                    selectedTopic={selectedTopic}
                    progress={progressRecords}
                    streakDays={streakDays}
                    sessionDurationMs={sessionDurationMs}
                  />
                </div>
              </div>
            )}

            {view === 'topic-complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 max-w-lg mx-auto text-center pt-20"
              >
                <div className="relative w-32 h-32 mx-auto mb-10">
                  <div className="absolute inset-0 bg-green-500/20 blur-3xl animate-pulse"></div>
                  <div className="relative w-full h-full bg-slate-900 border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <Trophy size={56} />
                  </div>
                </div>
                
                <h2 className="text-5xl font-light text-white mb-4 tracking-tight">Curriculum <span className="text-green-500 font-medium italic">Mastered</span></h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-12">
                  Temporal and factual synchronization complete. {selectedTopic?.title} is now integrated into your index.
                </p>
                
                <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-brand-border shadow-2xl mb-12 backdrop-blur-xl">
                   <div className="text-7xl font-mono text-brand-accent mb-2">
                     {Math.round((finalScore || 0) * 100)}<span className="text-2xl text-slate-600">%</span>
                   </div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Module Proficiency Level</div>
                </div>

                <button
                  onClick={resetToHome}
                  className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
                >
                  Return to Control Hub
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Bottom Activity Rail */}
        <footer className="h-14 border-t border-brand-border bg-brand-sidebar flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Learning Engine Online</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-slate-800"></div>
            <span className="hidden sm:inline text-[10px] text-slate-600 font-mono">PHASE 2 ANALYTICS ACTIVE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] text-slate-500 uppercase tracking-widest font-bold">Curriculum Signal</span>
            <div className="flex gap-1.5">
              <div className="w-4 h-1 bg-brand-accent rounded-full shadow-[0_0_5px_rgba(34,211,238,0.5)]"></div>
              <div className="w-4 h-1 bg-brand-accent rounded-full shadow-[0_0_5px_rgba(34,211,238,0.5)]"></div>
              <div className="w-4 h-1 bg-brand-accent rounded-full shadow-[0_0_5px_rgba(34,211,238,0.5)]"></div>
              <div className="w-4 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-4 h-1 bg-slate-800 rounded-full"></div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
