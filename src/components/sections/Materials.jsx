import React, { useState } from 'react';
import { CATEGORIES, ESSAY_DATABASE, ESSAY_RUBRIC } from '../../data/materialsData';
import DictationLab from './DictationLab';
import DashboardLayout from '../layout/DashboardLayout';

const Materials = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [viewMode, setViewMode] = useState('categories'); // 'categories', 'essay-db', or 'rubric'

    const renderCategories = () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {/* Interactive Essay Database Card */}
            <div
                onClick={() => setViewMode('essay-db')}
                style={{
                    background: '#fff', borderRadius: 20, overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--accent-color)', cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                className="material-card"
            >
                <div style={{ background: 'var(--accent-color)', padding: '20px 24px', borderBottom: '1px solid var(--accent-color)' }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--primary-color)' }}>💎 Essay Structures</h3>
                </div>
                <div style={{ padding: '24px' }}>
                    <p style={{ fontSize: 14, color: '#475569', margin: '0 0 20px', lineHeight: 1.6 }}>
                        Master 10+ professional structures, linking phrases, and advanced academic vocabulary.
                    </p>
                    <button style={{
                        width: '100%', padding: '12px', borderRadius: 12,
                        background: 'var(--primary-color)', color: '#fff', border: 'none',
                        fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 59, 102, 0.2)'
                    }}>Study Templates →</button>
                </div>
            </div>

            {/* AI Rubric card */}
            <div
                onClick={() => setViewMode('rubric')}
                style={{
                    background: '#fff', borderRadius: 20, overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--accent-color)', cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                className="material-card"
            >
                <div style={{ background: 'var(--accent-color)', padding: '20px 24px', borderBottom: '1px solid var(--accent-color)' }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--primary-color)' }}>🤖 AI Evaluation Rubric</h3>
                </div>
                <div style={{ padding: '24px' }}>
                    <p style={{ fontSize: 14, color: '#475569', margin: '0 0 20px', lineHeight: 1.6 }}>
                        Understand how the AI scores your response. Full breakdown of official PTE scoring criteria.
                    </p>
                    <button style={{
                        width: '100%', padding: '12px', borderRadius: 12,
                        background: 'var(--primary-color)', color: '#fff', border: 'none',
                        fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(13, 59, 102, 0.2)'
                    }}>View Breakdown →</button>
                </div>
            </div>

            {/* Dictation Lab card */}
            <div
                onClick={() => setViewMode('dictation-lab')}
                style={{
                    background: '#fff', borderRadius: 20, overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--accent-color)', cursor: 'pointer',
                    transition: 'all 0.3s ease'
                }}
                className="material-card"
            >
                <div style={{ background: '#eff6ff', padding: '20px 24px', borderBottom: '1px solid #dbeafe' }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1e40af' }}>🎧 Dictation Lab</h3>
                </div>
                <div style={{ padding: '24px' }}>
                    <p style={{ fontSize: 14, color: '#475569', margin: '0 0 20px', lineHeight: 1.6 }}>
                        Practice high-frequency PTE sentences in a real test simulation environment with AI scoring.
                    </p>
                    <button style={{
                        width: '100%', padding: '12px', borderRadius: 12,
                        background: '#2563eb', color: '#fff', border: 'none',
                        fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}>Open Lab →</button>
                </div>
            </div>

            {CATEGORIES.map(cat => (
                <div key={cat.id} style={{
                    background: '#fff', borderRadius: 20, overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid #f1f5f9'
                }}>
                    <div style={{
                        background: cat.color + '15', padding: '20px 24px',
                        borderBottom: '1px solid #f1f5f9'
                    }}>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--primary-color)' }}>{cat.title}</h3>
                    </div>
                    <div style={{ padding: '16px 24px' }}>
                        {cat.items.map((item, idx) => (
                            <div key={idx} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px 0', borderBottom: idx < cat.items.length - 1 ? '1px solid #f1f5f9' : 'none'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10, background: '#f8fafc',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 10, fontWeight: 800, color: '#64748b', border: '1px solid #e2e8f0'
                                    }}>
                                        {item.type}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{item.title}</div>
                                        <div style={{ fontSize: 12, color: '#94a3b8' }}>Size: {item.size}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => alert(`Starting download: ${item.title}`)}
                                    style={{
                                        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
                                        padding: '8px 14px', fontSize: 12, fontWeight: 700, color: '#334155',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <style>{`.material-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08); }`}</style>
        </div>
    );

    const renderEssayDB = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <button
                onClick={() => { setViewMode('categories'); setSelectedTemplate(null); }}
                style={{
                    alignSelf: 'flex-start', padding: '10px 18px', borderRadius: 12,
                    border: '1px solid var(--accent-color)', background: '#fff', cursor: 'pointer',
                    fontWeight: 700, fontSize: 14, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: 8
                }}
            >
                ← Back to Materials
            </button>

            <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Templates List */}
                <div style={{ width: '100%', maxWidth: 320, background: '#fff', borderRadius: 20, padding: 20, border: '1px solid var(--accent-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <h4 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 800, color: 'var(--primary-color)' }}>Select Template</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {ESSAY_DATABASE.templates.map(tpl => (
                            <div
                                key={tpl.id}
                                onClick={() => setSelectedTemplate(tpl)}
                                style={{
                                    padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                                    background: selectedTemplate?.id === tpl.id ? 'var(--primary-color)' : '#f8fafc',
                                    color: selectedTemplate?.id === tpl.id ? '#fff' : 'var(--text-secondary)',
                                    fontWeight: selectedTemplate?.id === tpl.id ? 700 : 500,
                                    fontSize: 14, border: '1px solid',
                                    borderColor: selectedTemplate?.id === tpl.id ? 'var(--primary-color)' : '#e2e8f0',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tpl.title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Template Content */}
                <div style={{ flex: 1, minWidth: '320px', background: '#fff', borderRadius: 24, padding: 32, border: '1px solid var(--accent-color)', boxShadow: 'var(--shadow-sm)', minHeight: 600 }}>
                    {selectedTemplate ? (
                        <div style={{ animation: 'fadeIn 0.4s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>{selectedTemplate.title}</h2>
                                <span style={{ padding: '6px 14px', background: 'var(--accent-color)', color: 'var(--primary-color)', borderRadius: 10, fontSize: 12, fontWeight: 800 }}>
                                    {selectedTemplate.essay_type}
                                </span>
                            </div>
                            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 32, lineHeight: 1.6 }}>{selectedTemplate.description}</p>

                            <div style={{ background: '#fef3c7', padding: '20px 24px', borderRadius: 16, borderLeft: '6px solid #f59e0b', marginBottom: 40 }}>
                                <div style={{ fontSize: 12, fontWeight: 800, color: '#92400e', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Structure Strategy</div>
                                <div style={{ fontSize: 15, color: '#92400e', lineHeight: 1.6, fontWeight: 500 }}>{selectedTemplate.structure_guide}</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                                {Object.entries(selectedTemplate.frames).map(([section, frames]) => (
                                    <div key={section}>
                                        <h5 style={{ textTransform: 'uppercase', margin: '0 0 16px', fontSize: 13, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 12 }}>
                                            {section.replace(/_/g, ' ')}
                                            <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
                                        </h5>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                            {frames.map((f, i) => (
                                                <div key={i} style={{ padding: '20px', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0' }}>
                                                    <div style={{ fontSize: 15, lineHeight: '1.7', color: '#1e293b', fontWeight: 500 }}>{f.frame}</div>
                                                    <div style={{ marginTop: 12, fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                                                        Tone: {f.tone} &bull; {f.sentence_count} Sentences
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', padding: '100px 0' }}>
                            <div style={{ fontSize: 80, marginBottom: 24 }}>📝</div>
                            <h3 style={{ margin: '0 0 8px', color: '#64748b' }}>No Template Selected</h3>
                            <p>Select a structure from the left sidebar to start studying.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );

    const renderRubric = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <button
                onClick={() => setViewMode('categories')}
                style={{
                    alignSelf: 'flex-start', padding: '10px 18px', borderRadius: 12,
                    border: '1px solid var(--accent-color)', background: '#fff', cursor: 'pointer',
                    fontWeight: 700, fontSize: 14, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: 8
                }}
            >
                ← Back to Materials
            </button>

            <div style={{ background: '#fff', borderRadius: 32, border: '1px solid var(--accent-color)', padding: '48px', boxShadow: 'var(--shadow-lg)' }}>
                {/* Header */}
                <div style={{ borderBottom: '2px solid var(--secondary-color)', paddingBottom: 32, marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: 32, fontWeight: 800, letterSpacing: '-0.75px' }}>{ESSAY_RUBRIC.rubric_meta.title}</h2>
                        <p style={{ color: '#64748b', margin: '16px 0 0', maxWidth: 800, lineHeight: '1.7', fontSize: 16 }}>{ESSAY_RUBRIC.rubric_meta.description}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40 }}>
                    {ESSAY_RUBRIC.criteria.map((criterion) => (
                        <div key={criterion.id} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>{criterion.name}</h3>
                                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--secondary-color)', background: 'var(--accent-color)', padding: '4px 10px', borderRadius: 8 }}>{criterion.max_score} Pts</div>
                            </div>
                            <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{criterion.description}</p>
                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: 16, padding: '20px', border: '1px solid #e2e8f0' }}>
                                {criterion.scoring_guide && Object.entries(criterion.scoring_guide).map(([level, info]) => (
                                    <div key={level} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: level === 'high' ? '#10b981' : level === 'medium' ? '#f59e0b' : '#ef4444', marginTop: 5 }} />
                                            <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>{info.score_range} Points</span>
                                        </div>
                                        <p style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{info.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderDictationLab = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <button
                onClick={() => setViewMode('categories')}
                style={{
                    alignSelf: 'flex-start', padding: '10px 18px', borderRadius: 12,
                    border: '1px solid var(--accent-color)', background: '#fff', cursor: 'pointer',
                    fontWeight: 700, fontSize: 14, color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: 8
                }}
            >
                ← Back to Materials
            </button>
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--accent-color)' }}>
                <DictationLab />
            </div>
        </div>
    );

    const renderContent = () => {
        switch (viewMode) {
            case 'essay-db': return renderEssayDB();
            case 'rubric': return renderRubric();
            case 'dictation-lab': return renderDictationLab();
            default: return renderCategories();
        }
    };

    return (
        <DashboardLayout activePath="/materials">
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-color)', marginBottom: 8 }}>📁 Preparation Materials</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Exclusive study resources, evaluation rubrics, and interactive labs.</p>
                </div>
                {renderContent()}
            </div>
        </DashboardLayout>
    );
};

export default Materials;
