import React, { useState, useEffect } from 'react';
import { Classroom, Assignment, AssignmentItem, Topic } from '../types';
import { teacherDataService } from '../services/teacherDataService';
import { assignmentService } from '../services/assignmentService';
import { 
    CheckSquare, Square, Calendar, ChevronRight, ChevronLeft, 
    Save, BookOpen, Brain, Clock, AlertTriangle 
} from 'lucide-react';
import { studentDataService } from '../services/studentDataService';

interface Props {
    user: { username: string };
    onClose: () => void;
    onSave: () => void;
}

const AssignmentBuilder: React.FC<Props> = ({ user, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [classes, setClasses] = useState<Classroom[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);

    useEffect(() => {
        teacherDataService.getClasses(user.username).then(setClasses);
    }, [user.username]);

    useEffect(() => {
        studentDataService.getDashboardData('temp').then(data => {
            setTopics(data.topics);
        });
    }, []);

    // Form State
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [selectedItems, setSelectedItems] = useState<AssignmentItem[]>([]);
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [allowLate, setAllowLate] = useState(true);
    const [status, setStatus] = useState<'draft' | 'published'>('published');

    // UI State for Step 2
    const [contentTab, setContentTab] = useState<'lessons' | 'quizzes'>('lessons');

    // -- HANDLERS --

    const toggleClass = (id: string) => {
        if (selectedClassIds.includes(id)) {
            setSelectedClassIds(prev => prev.filter(c => c !== id));
        } else {
            setSelectedClassIds(prev => [...prev, id]);
        }
    };

    const toggleItem = (item: AssignmentItem) => {
        if (selectedItems.find(i => i.id === item.id)) {
            setSelectedItems(prev => prev.filter(i => i.id !== item.id));
        } else {
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const handleSave = (publishStatus: 'draft' | 'published') => {
        if (!title || selectedClassIds.length === 0 || selectedItems.length === 0) {
            alert("Please fill in all required fields.");
            return;
        }

        const newAssignment: Assignment = {
            id: `asg-${Date.now()}`,
            teacherId: user.username,
            classIds: selectedClassIds,
            title,
            instructions,
            dueDate: new Date(dueDate).getTime(),
            allowLate,
            status: publishStatus,
            items: selectedItems.map((item, idx) => ({ ...item, order: idx + 1 })),
            createdAt: Date.now()
        };

        assignmentService.saveAssignment(newAssignment);
        onSave();
        onClose();
    };

    // -- RENDER STEPS --

    const renderStep1 = () => (
        <div className="space-y-4 animate-fade-in-right">
            <h3 className="text-xl font-bold text-white mb-2">Select Classes</h3>
            <p className="text-slate-400 text-sm mb-4">Who is this assignment for?</p>
            <div className="grid md:grid-cols-2 gap-4">
                {classes.map(cls => (
                    <div 
                        key={cls.id}
                        onClick={() => toggleClass(cls.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedClassIds.includes(cls.id) 
                                ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                                : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white">{cls.name}</span>
                            {selectedClassIds.includes(cls.id) 
                                ? <CheckSquare className="w-5 h-5 text-purple-400" /> 
                                : <Square className="w-5 h-5 text-slate-600" />
                            }
                        </div>
                        <p className="text-xs text-slate-500">{cls.studentCount} Students • {cls.subject}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4 animate-fade-in-right">
            <h3 className="text-xl font-bold text-white mb-2">Choose Content</h3>
            <div className="flex gap-4 border-b border-slate-800 mb-4">
                <button 
                    onClick={() => setContentTab('lessons')}
                    className={`pb-2 px-4 text-sm font-bold border-b-2 transition-colors ${contentTab === 'lessons' ? 'border-purple-500 text-white' : 'border-transparent text-slate-500'}`}
                >
                    Lessons ({topics.length})
                </button>
                <button 
                    onClick={() => setContentTab('quizzes')}
                    className={`pb-2 px-4 text-sm font-bold border-b-2 transition-colors ${contentTab === 'quizzes' ? 'border-purple-500 text-white' : 'border-transparent text-slate-500'}`}
                >
                    Quizzes (15)
                </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {contentTab === 'lessons' ? (
                    topics.map(topic => {
                        const itemId = `lesson-${topic.id}`;
                        const isSelected = selectedItems.some(i => i.id === itemId);
                        return (
                            <div 
                                key={topic.id}
                                onClick={() => toggleItem({ id: itemId, type: 'lesson', contentId: topic.id, title: topic.title, order: 0 })}
                                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                    isSelected ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded">
                                        <BookOpen className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{topic.title}</p>
                                        <p className="text-xs text-slate-500">{topic.totalLessons} Slides • {topic.difficulty}</p>
                                    </div>
                                </div>
                                {isSelected && <CheckSquare className="w-5 h-5 text-cyan-400" />}
                            </div>
                        );
                    })
                ) : (
                    topics.map(topic => {
                         const itemId = `quiz-${topic.id}`;
                         const isSelected = selectedItems.some(i => i.id === itemId);
                         return (
                            <div 
                                key={topic.id}
                                onClick={() => toggleItem({ id: itemId, type: 'quiz', contentId: `quiz_${topic.id}`, title: `${topic.title} Quiz`, order: 0 })}
                                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                                    isSelected ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-800 rounded">
                                        <Brain className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{topic.title} Quiz</p>
                                        <p className="text-xs text-slate-500">10 Questions • {topic.difficulty}</p>
                                    </div>
                                </div>
                                {isSelected && <CheckSquare className="w-5 h-5 text-purple-400" />}
                            </div>
                        );
                    })
                )}
            </div>
            <div className="flex justify-between items-center bg-slate-800 p-2 rounded text-xs text-slate-400">
                <span>Selected Items: {selectedItems.length}</span>
                {selectedItems.length > 0 && <span className="text-white font-bold">{selectedItems.map(i => i.type).join(', ')}</span>}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4 animate-fade-in-right">
            <h3 className="text-xl font-bold text-white mb-2">Assignment Details</h3>
            
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Title</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Week 3: Cell Biology Review"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Due Date</label>
                    <input 
                        type="date" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Settings</label>
                    <div className="flex items-center gap-2 h-10">
                        <input 
                            type="checkbox" 
                            checked={allowLate}
                            onChange={(e) => setAllowLate(e.target.checked)}
                            className="rounded bg-slate-800 border-slate-600 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-slate-300">Allow Late Submissions</span>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Instructions</label>
                <textarea 
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={4}
                    placeholder="Instructions for your students..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6 animate-fade-in-right">
            <h3 className="text-xl font-bold text-white mb-2">Review & Publish</h3>
            
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                    <div>
                        <h4 className="text-lg font-bold text-white">{title}</h4>
                        <p className="text-sm text-slate-400">{selectedClassIds.length} Classes • {selectedItems.length} Items</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-slate-500 uppercase">Due Date</span>
                        <p className="text-white font-medium">{dueDate || 'No Date Set'}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">Content to Complete</p>
                    {selectedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded">
                            <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                {idx + 1}
                            </span>
                            <span className="text-sm text-slate-200">{item.title}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-400 uppercase border border-slate-700 ml-auto">
                                {item.type}
                            </span>
                        </div>
                    ))}
                </div>

                {(!dueDate || selectedClassIds.length === 0 || !title) && (
                    <div className="flex items-center gap-2 p-3 bg-red-900/20 text-red-400 text-sm rounded border border-red-900/50">
                        <AlertTriangle className="w-4 h-4" />
                        Missing required fields. Please review previous steps.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">Create Assignment</h2>
                        <div className="flex items-center gap-2 mt-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-purple-500' : 'w-4 bg-slate-700'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-slate-950">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-slate-400 hover:text-white flex items-center gap-1">
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    ) : (
                        <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                    )}

                    {step < 4 ? (
                        <button 
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center gap-2"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleSave('draft')}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Save Draft
                            </button>
                            <button 
                                onClick={() => handleSave('published')}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-purple-900/20"
                            >
                                <CheckSquare className="w-4 h-4" /> Assign Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentBuilder;
