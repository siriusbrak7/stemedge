
import React, { useEffect, useState } from 'react';
import { useTour } from '../contexts/TourContext';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

const TourGuide: React.FC = () => {
    const { isActive, currentStepIndex, steps, nextStep, prevStep, endTour } = useTour();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (isActive) {
            const step = steps[currentStepIndex];
            const element = document.querySelector(step.target);
            
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTargetRect(element.getBoundingClientRect());
            } else if (step.target === 'body') {
                // Special case for welcome modal (center)
                setTargetRect(null);
            }
        }
    }, [isActive, currentStepIndex, steps]);

    if (!isActive) return null;

    const currentStep = steps[currentStepIndex];
    const isFirst = currentStepIndex === 0;
    const isLast = currentStepIndex === steps.length - 1;

    // Calculate position for tooltip
    let tooltipStyle: React.CSSProperties = {};
    
    if (targetRect) {
        // Positioning logic
        const gap = 12;
        const top = targetRect.bottom + gap;
        const left = targetRect.left + (targetRect.width / 2) - 150; // Center roughly
        
        tooltipStyle = {
            top: `${top}px`,
            left: `${Math.max(10, Math.min(window.innerWidth - 310, left))}px`, // Clamp to screen
            position: 'fixed'
        };
        
        if (currentStep.position === 'top') {
            tooltipStyle.top = `${targetRect.top - 180}px`;
        } else if (currentStep.position === 'left') {
            tooltipStyle.left = `${targetRect.left - 320}px`;
            tooltipStyle.top = `${targetRect.top}px`;
        }
    } else {
        // Center for welcome
        tooltipStyle = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed'
        };
    }

    return (
        <div className="fixed inset-0 z-[1000] pointer-events-auto">
            {/* Dark Overlay with cutout */}
            <div className="absolute inset-0 bg-slate-950/80 mix-blend-hard-light" 
                 style={{ 
                     clipPath: targetRect 
                        ? `polygon(0% 0%, 0% 100%, ${targetRect.left}px 100%, ${targetRect.left}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.top}px, ${targetRect.right}px ${targetRect.bottom}px, ${targetRect.left}px ${targetRect.bottom}px, ${targetRect.left}px 100%, 100% 100%, 100% 0%)` 
                        : 'none' 
                 }}
            />
            
            {/* Highlight Ring */}
            {targetRect && (
                <div 
                    className="absolute border-2 border-cyan-400 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300 pointer-events-none"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8
                    }}
                />
            )}

            {/* Tooltip Card */}
            <div 
                className="bg-white text-slate-900 rounded-xl p-6 shadow-2xl w-[300px] animate-fade-in-up"
                style={tooltipStyle}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
                        Step {currentStepIndex + 1}/{steps.length}
                    </span>
                    <button onClick={endTour} className="text-slate-400 hover:text-slate-900">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <h3 className="text-lg font-bold mb-2">{currentStep.title}</h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {currentStep.content}
                </p>

                <div className="flex justify-between items-center">
                    <button 
                        onClick={prevStep}
                        disabled={isFirst}
                        className="text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex gap-1">
                        {steps.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === currentStepIndex ? 'bg-cyan-600' : 'bg-slate-200'}`} />
                        ))}
                    </div>

                    <button 
                        onClick={nextStep}
                        className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors"
                    >
                        {isLast ? 'Finish' : 'Next'} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourGuide;
