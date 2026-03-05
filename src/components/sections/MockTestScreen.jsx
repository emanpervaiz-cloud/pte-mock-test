import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListItem from '../ui/ListItem';
import Button from '../ui/Button';

const MockTestScreen = () => {
    const navigate = useNavigate();
    const mockTests = [
        { id: 1, questions: 72, time: '2h 15m', difficulty: 'Official' },
        { id: 2, questions: 68, time: '2h 05m', difficulty: 'Practice A' },
        { id: 3, questions: 75, time: '2h 20m', difficulty: 'Advanced' },
        { id: 4, questions: 70, time: '2h 10m', difficulty: 'Standard' },
    ];

    return (
        <div style={{ padding: 'var(--mobile-margin)', background: 'var(--color-background)', minHeight: '100vh' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>Mock Tests</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', margin: '4px 0 0 0' }}>Full Exam Simulation</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'calc(80px + var(--safe-area-bottom))' }}>
                {mockTests.map((test) => (
                    <div
                        key={test.id}
                        style={{
                            background: '#fff',
                            borderRadius: 'var(--mobile-radius)',
                            padding: '20px',
                            border: '1px solid var(--color-border)',
                            marginBottom: '16px',
                            boxShadow: 'var(--shadow-soft)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div>
                                <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-primary)' }}>Mock Test #{test.id}</div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-secondary)', fontWeight: 700 }}>{test.difficulty}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-sub)' }}>{test.questions} Questions</div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-sub)' }}>{test.time} Duration</div>
                            </div>
                        </div>
                        <Button variant="primary" fullWidth onClick={() => navigate('/intro')}>
                            Start Test Now
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MockTestScreen;
