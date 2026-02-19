import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { quizPracticeService } from '../services/quizPracticeService';
import QuizPlayer from '../components/QuizPlayer';
import { Quiz } from '../types';
import { ArrowLeft } from 'lucide-react';

const PracticeQuizPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        if (!topicId) return;

        const count = searchParams.get('count');
        const difficulty = searchParams.get('difficulty');
        
        const questionCount = count === 'All' ? 'All' : parseInt(count || '10');
        const difficultyFilter = difficulty && difficulty !== 'all' ? difficulty : undefined;

        const questions = quizPracticeService.getQuestionsByFilter(
            topicId, 
            questionCount, 
            difficultyFilter
        );

        if (questions.length === 0) {
            // Fallback if no questions match filters
            setQuiz({
                id: `practice-${topicId}`,
                topicId: topicId,
                topicTitle: topicId.replace('_', ' '),
                questions: []
            });
            return;
        }

        setQuiz({
            id: `practice-${topicId}`,
            topicId: topicId,
            topicTitle: topicId.replace('_', ' '),
            questions: questions
        });
    }, [topicId, searchParams]);

    if (!quiz) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (quiz.questions.length === 0) {
        return (
            <div className="min-h-screen pt-24 px-4 max-w-2xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-bold text-white mb-4">No Questions Available</h2>
                    <p className="text-slate-400 mb-6">No questions match your selected filters. Try different settings.</p>
                    <button
                        onClick={() => navigate('/dashboard/student')}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
            </div>
            <QuizPlayer 
                customQuiz={quiz}
                onClose={() => navigate('/dashboard/student')}
            />
        </div>
    );
};

export default PracticeQuizPage;
