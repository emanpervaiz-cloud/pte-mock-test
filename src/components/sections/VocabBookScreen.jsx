import React, { useState } from 'react';
import Button from '../ui/Button';

const VocabBookScreen = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const vocabData = [
        { word: 'Pragmatic', definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.', example: 'A pragmatic approach to politics.' },
        { word: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', example: 'His ubiquitous influence was felt by all.' },
        { word: 'Ephemeral', definition: 'Lasting for a very short time.', example: 'Fashions are ephemeral.' },
    ];

    const current = vocabData[currentIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % vocabData.length);
    };

    return (
        <div style={{ padding: 'var(--mobile-margin)', background: 'var(--color-background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>Vocab Book</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', margin: '4px 0 0 0' }}>Flashcard Style Learning</p>
            </header>

            {/* Flashcard */}
            <div
                onClick={() => setIsFlipped(!isFlipped)}
                style={{
                    perspective: '1000px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '32px'
                }}
            >
                <div style={{
                    width: '100%',
                    maxWidth: '320px',
                    height: '400px',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent'
                }}>
                    {/* Front */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        background: '#ffffff',
                        borderRadius: '24px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-medium)',
                        border: '2px solid var(--color-primary-light)'
                    }}>
                        <span style={{ fontSize: 'var(--font-size-jumbo)', fontWeight: 800, color: 'var(--color-primary)', textAlign: 'center' }}>
                            {current.word}
                        </span>
                        <span style={{ position: 'absolute', bottom: '24px', fontSize: '12px', color: 'var(--color-text-sub)', fontWeight: 600 }}>
                            TAP TO REVEAL MEANING
                        </span>
                    </div>

                    {/* Back */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        background: 'var(--color-primary)',
                        color: '#ffffff',
                        borderRadius: '24px',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-medium)',
                        transform: 'rotateY(180deg)'
                    }}>
                        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '12px' }}>Definition</h3>
                        <p style={{ fontSize: 'var(--font-size-base)', opacity: 0.9, lineHeight: 1.6, marginBottom: '24px' }}>
                            {current.definition}
                        </p>
                        <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '8px' }}>Example</h3>
                        <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8, fontStyle: 'italic', lineHeight: 1.5 }}>
                            "{current.example}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: 'calc(80px + var(--safe-area-bottom))' }}>
                <Button variant="outline" fullWidth onClick={handleNext} icon="🔄">
                    Skip
                </Button>
                <Button variant="primary" fullWidth onClick={handleNext} icon="✅">
                    Mastered
                </Button>
            </div>

            {/* Progress Footer indicator */}
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '13px', color: 'var(--color-text-sub)', fontWeight: 600 }}>
                Card {currentIndex + 1} of {vocabData.length}
            </div>
        </div>
    );
};

export default VocabBookScreen;
