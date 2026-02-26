import React from 'react';

const SidebarOverview = ({ history, targetScore, avgScore, lastScore, onStartTest, onShowTargetModal }) => {

    const recentHistory = [...history].reverse().slice(0, 5);

    return (
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Quick Start CTA */}
            <div style={{
                background: 'linear-gradient(135deg, #3949ab, #7c4dff)',
                borderRadius: 14, padding: '20px',
                boxShadow: '0 4px 16px rgba(57,73,171,0.25)',
            }}>
                <h4 style={{ color: '#fff', margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>🚀 Ready to Test?</h4>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: '0 0 14px', lineHeight: 1.5 }}>
                    Take a full mock test and get your estimated PTE score instantly.
                </p>
                <button
                    onClick={onStartTest}
                    style={{
                        width: '100%', background: '#ffd740', color: '#3d1a78',
                        border: 'none', borderRadius: 8, padding: '10px',
                        fontWeight: 700, fontSize: 13, cursor: 'pointer',
                    }}>
                    Start Mock Test →
                </button>
            </div>

            {/* Score Overview */}
            <div style={{
                background: '#fff', borderRadius: 14, padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#333' }}>📈 Score Overview</h4>
                    <button
                        onClick={onShowTargetModal}
                        style={{
                            background: 'none', border: 'none', color: '#3949ab', fontSize: '12px',
                            cursor: 'pointer', fontWeight: 600, textDecoration: 'underline'
                        }}
                    >
                        Edit Target
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {[
                        { label: 'Tests Taken', value: history.length, color: '#3949ab', bg: '#eef2ff' },
                        { label: 'Avg Score', value: avgScore || '—', color: '#059669', bg: '#ecfdf5' },
                        { label: 'Last Score', value: lastScore || '—', color: '#d97706', bg: '#fffbeb' },
                        { label: 'Target', value: `${targetScore}+`, color: '#e11d48', bg: '#fff1f2' },
                    ].map((stat) => (
                        <div key={stat.label} style={{
                            background: stat.bg, borderRadius: 10, padding: '12px',
                            textAlign: 'center', border: `1px solid ${stat.color}22`
                        }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, fontWeight: 500 }}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Practiced History */}
            <div style={{
                background: '#fff', borderRadius: 14, padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flex: 1,
            }}>
                <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: '#333' }}>🕐 Recent History</h4>

                {recentHistory.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
                        <div style={{ fontSize: 32 }}>📭</div>
                        <p style={{ fontSize: 13, marginTop: 8 }}>No mock tests completed yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {recentHistory.map((test, i) => (
                            <div key={i} style={{
                                border: '1px solid #f1f5f9', borderRadius: 10, padding: '12px',
                                background: '#f8fafc',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                                        {test.date}
                                    </span>
                                    <span style={{ fontSize: 11, color: '#64748b' }}>Items: {test.totalAnswered || '—'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Mock Test #{history.length - i}</span>
                                    <span style={{
                                        background: test.overall >= targetScore ? '#dcfce7' : '#fef3c7',
                                        color: test.overall >= targetScore ? '#166534' : '#92400e',
                                        borderRadius: '6px', padding: '2px 8px', fontSize: 13, fontWeight: 700,
                                    }}>{test.overall}/90</span>
                                </div>
                                {/* Mini section scores */}
                                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                                    {['speaking', 'writing', 'reading', 'listening'].map(s => (
                                        <span key={s} style={{
                                            fontSize: 10, background: '#fff', color: '#3b82f6',
                                            border: '1px solid #bfdbfe', borderRadius: 4, padding: '2px 6px',
                                            fontWeight: 600
                                        }}>
                                            {s.slice(0, 1).toUpperCase()}: {test[s] || '—'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default SidebarOverview;
