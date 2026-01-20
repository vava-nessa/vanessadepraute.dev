import { useState, useEffect } from 'react';

interface TypeWriterProps {
    words: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
}

export const TypeWriter = ({
    words,
    typingSpeed = 150,
    deletingSpeed = 100,
    pauseDuration = 2000,
    className = '',
}: TypeWriterProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentWord = words[currentWordIndex];

        if (isPaused) {
            const pauseTimeout = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, pauseDuration);
            return () => clearTimeout(pauseTimeout);
        }

        if (!isDeleting && currentText === currentWord) {
            // Finished typing, pause before deleting
            setIsPaused(true);
            return;
        }

        if (isDeleting && currentText === '') {
            // Finished deleting, move to next word
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(
            () => {
                if (isDeleting) {
                    setCurrentText(currentWord.substring(0, currentText.length - 1));
                } else {
                    setCurrentText(currentWord.substring(0, currentText.length + 1));
                }
            },
            isDeleting ? deletingSpeed : typingSpeed
        );

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

    return (
        <span className={className}>
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    );
};

export default TypeWriter;
