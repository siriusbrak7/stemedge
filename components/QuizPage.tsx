
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizPlayer from './QuizPlayer';
import { X } from 'lucide-react';

const QuizPage: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <span className="text-xl">📝</span>
                        </div>
                        <span className="text-white font-bold">Assessment Mode</span>
                    </div>
                    <button 
                        onClick={() => {
                            if(window.confirm("Quit quiz? Progress may be lost.")) {
                                navigate(-1);
                            }
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {quizId ? (
                    <QuizPlayer 
                        quizId={quizId} 
                        onClose={() => navigate(-1)} 
                    />
                ) : (
                    <div className="text-white text-center mt-20">Quiz ID missing</div>
                )}
            </div>
        </div>
    );
};

export default QuizPage;
