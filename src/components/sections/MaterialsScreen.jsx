import React from 'react';
import ListItem from '../ui/ListItem';

const MaterialsScreen = () => {
    const materials = [
        { title: 'PTE Speaking Masterclass', subtitle: 'Video Lectures • 2.5 hours', icon: '📽️', type: 'video' },
        { title: 'Academic Vocabulary List', subtitle: 'PDF Document • 45 KB', icon: '📄', type: 'pdf' },
        { title: 'Listening Practice Audio', subtitle: 'Audio Pack • 12 Tracks', icon: '🎧', type: 'audio' },
        { title: 'PTE Scoring Guide 2026', subtitle: 'PDF Document • 1.2 MB', icon: '📋', type: 'pdf' },
        { title: 'Grammar Cheat Sheet', subtitle: 'Quick Reference • 2 Pages', icon: '💡', type: 'pdf' },
    ];

    return (
        <div style={{ padding: 'var(--mobile-margin)', background: 'var(--color-background)', minHeight: '100vh' }}>
            <header style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>Materials</h1>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', margin: '4px 0 0 0' }}>Study Resources & Guides</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: 'calc(80px + var(--safe-area-bottom))' }}>
                {materials.map((item, idx) => (
                    <ListItem
                        key={idx}
                        title={item.title}
                        subtitle={item.subtitle}
                        icon={item.icon}
                        rightElement={
                            <div style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: 'var(--color-primary-light)',
                                color: 'var(--color-primary)',
                                fontSize: '12px',
                                fontWeight: 700
                            }}>
                                VIEW
                            </div>
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default MaterialsScreen;
