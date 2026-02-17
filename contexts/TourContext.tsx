
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

export interface TourStep {
    target: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourContextType {
    isActive: boolean;
    currentStepIndex: number;
    startTour: () => void;
    endTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    steps: TourStep[];
}

const TourContext = createContext<TourContextType | undefined>(undefined);

// Define the tour steps
const TOUR_STEPS: TourStep[] = [
    { 
        target: 'body', 
        title: 'Welcome to StemEdge!', 
        content: 'This 60-second tour will show you how to navigate your new command center.' 
    },
    { 
        target: '#streak-counter', 
        title: 'Track Your Progress', 
        content: 'Keep your learning streak alive! Log in daily to earn rewards.',
        position: 'bottom'
    },
    { 
        target: '#curriculum', 
        title: 'Your Curriculum', 
        content: 'Here are your active modules. Click "Start" or "Resume" to dive back in.',
        position: 'top'
    },
    { 
        target: '#nova-trigger', 
        title: 'Meet Nova', 
        content: 'Stuck? Click here to ask Nova, your AI tutor, for help anytime.',
        position: 'left'
    },
    { 
        target: '#features', 
        title: 'Ready for Liftoff', 
        content: 'You are all set. Explore the virtual labs and interactive lessons now!',
        position: 'bottom'
    }
];

export const TourProvider: React.FC<{ children: React.ReactNode, user: User | null }> = ({ children, user }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Auto-start for new students
    useEffect(() => {
        if (user && user.role === 'student') {
            const hasSeenTour = localStorage.getItem(`tour_seen_${user.username}`);
            if (!hasSeenTour) {
                setTimeout(() => startTour(), 1000); // Delay for UI load
            }
        }
    }, [user]);

    const startTour = () => {
        setIsActive(true);
        setCurrentStepIndex(0);
    };

    const endTour = () => {
        setIsActive(false);
        if (user) {
            localStorage.setItem(`tour_seen_${user.username}`, 'true');
        }
    };

    const nextStep = () => {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            endTour();
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    return (
        <TourContext.Provider value={{ isActive, currentStepIndex, startTour, endTour, nextStep, prevStep, steps: TOUR_STEPS }}>
            {children}
        </TourContext.Provider>
    );
};

export const useTour = () => {
    const context = useContext(TourContext);
    if (!context) throw new Error('useTour must be used within TourProvider');
    return context;
};
