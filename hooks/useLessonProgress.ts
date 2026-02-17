
import { useState, useEffect } from 'react';

const NOTES_KEY = 'stemedge_user_notes';

interface BaseSlide {
    id: number;
}

export const useLessonProgress = <T extends BaseSlide>(lessonId: string, slides: T[]) => {
    const STORAGE_KEY = `stemedge_${lessonId}_progress`;
    
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [completedSlides, setCompletedSlides] = useState<number[]>([]);
    const [savedNotes, setSavedNotes] = useState<string[]>([]);

    // Load from storage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const data = JSON.parse(stored);
            setCompletedSlides(data.completed || []);
            // Optional: Restore last position
            // setCurrentSlideIndex(data.lastIndex || 0);
        }

        const notes = localStorage.getItem(NOTES_KEY);
        if (notes) {
            setSavedNotes(JSON.parse(notes));
        }
    }, [STORAGE_KEY]);

    // Save progress
    useEffect(() => {
        if (!completedSlides.includes(currentSlideIndex)) {
            const newCompleted = [...completedSlides, currentSlideIndex];
            setCompletedSlides(newCompleted);
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                completed: newCompleted,
                lastIndex: currentSlideIndex
            }));
        }
    }, [currentSlideIndex, completedSlides, STORAGE_KEY]);

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    const goToSlide = (index: number) => {
        if (index >= 0 && index < slides.length) {
            setCurrentSlideIndex(index);
        }
    };

    const saveNote = (note: string) => {
        const updated = [...savedNotes, note];
        setSavedNotes(updated);
        localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    };

    return {
        currentSlideIndex,
        currentSlide: slides[currentSlideIndex],
        totalSlides: slides.length,
        progressPercent: Math.round((completedSlides.length / slides.length) * 100),
        completedSlides,
        nextSlide,
        prevSlide,
        goToSlide,
        saveNote,
        savedNotes
    };
};
