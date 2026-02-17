
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CellBiologyLesson from './CellBiologyLesson';
import PhotosynthesisLesson from './PhotosynthesisLesson';
import HumanBodyLesson from './HumanBodyLesson';
import EnzymesLesson from './EnzymesLesson';
import GeneticsLesson from './GeneticsLesson';
import EvolutionLesson from './EvolutionLesson';
import EcologyLesson from './EcologyLesson';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const LessonView: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    switch (topicId) {
        case 'cell_biology': return <CellBiologyLesson onBack={handleBack} />;
        case 'plant_nutrition': return <PhotosynthesisLesson onBack={handleBack} />;
        case 'human_body': return <HumanBodyLesson onBack={handleBack} />;
        case 'enzymes': return <EnzymesLesson onBack={handleBack} />;
        case 'inheritance': return <GeneticsLesson onBack={handleBack} />;
        case 'evolution': return <EvolutionLesson onBack={handleBack} />;
        case 'ecology': return <EcologyLesson onBack={handleBack} />;
        default:
            return (
                <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-800">
                        <AlertTriangle className="w-10 h-10 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Lesson Not Found</h1>
                    <p className="text-slate-400 mb-8 max-w-md">
                        The requested module "{topicId}" could not be located in the archives. It may be under development or classified.
                    </p>
                    <button 
                        onClick={handleBack}
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Base
                    </button>
                </div>
            );
    }
};

export default LessonView;
