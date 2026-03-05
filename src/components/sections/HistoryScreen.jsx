import React from 'react';
import { useNavigate } from 'react-router-dom';
import ListItem from '../ui/ListItem';

const HistoryScreen = () => {
    const navigate = useNavigate();
    const history = [
        { id: 12, date: 'Mar 02, 2026', overall: 72, cefr: 'B2', status: 'Passed' },
        { id: 11, date: 'Feb 28, 2026', overall: 68, cefr: 'B2', status: 'Passed' },
        { id: 10, date: 'Feb 24, 2026', overall: 65, cefr: 'B1', status: 'Passed' },
        { id: 9, date: 'Feb 20, 2026', overall: 61, cefr: 'B1', status: 'Warning' },
    ];

    return (
        <div style={{ padding: 'var(--mobile-margin)', background: 'var(--color-background)', minHeight: '100vh' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>Test History</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', margin: '4px 0 0 0' }}>Past Performance & Results</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'calc(80px + var(--safe-area-bottom))' }}>
                {history.map((test) => (
                    <ListItem
                        key={test.id}
                        title={`Mock Test #${test.id}`}
                        subtitle={`${test.date} • ${test.status}`}
                        icon="📋"
                        onClick={() => navigate('/results')}
                        rightElement={
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '20px',
                                    fontWeight: 800,
                                    color: test.overall >= 65 ? 'var(--color-success)' : 'var(--color-warning)'
                                }}>
                                    {test.overall}/90
                                </div>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sub)' }}>
                                    CEFR: {test.cefr}
                                </div>
                            </div>
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default HistoryScreen;
