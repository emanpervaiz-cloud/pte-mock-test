import React, { useState, useMemo } from 'react';
import vocabDataJson from './pte_basic_vocab.json';
import DashboardLayout from '../layout/DashboardLayout';

const VocabBook = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const VOCAB_DATA = useMemo(() => {
        const basicList = vocabDataJson?.basic_vocabulary || [];
        return basicList.map(item => ({
            id: item.id || Math.random(),
            word: item.word || 'Unknown Word',
            type: item.type || 'N/A',
            definition: item.meaning || 'No definition available.',
            example: item.example_sentence || 'No example available.',
            synonyms: item.synonym || [],
            collocations: item.collocations || [],
            pteTasks: item.pte_task || []
        }));
    }, []);

    const getFilterType = (typeStr) => {
        if (!typeStr || typeof typeStr !== 'string') return 'Other';
        const lower = typeStr.toLowerCase();
        if (lower.includes('verb')) return 'Verb';
        if (lower.includes('noun')) return 'Noun';
        if (lower.includes('adjective') || lower.includes('adj')) return 'Adj';
        if (lower.includes('adverb') || lower.includes('adv')) return 'Adv';
        return 'Other';
    };

    const filteredData = VOCAB_DATA.filter(item => {
        const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase());
        const mappedType = getFilterType(item.type);
        const matchesFilter = filter === 'All' || mappedType === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout activePath="/vocab">
            <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary-color)', marginBottom: 8 }}>📚 Vocab Book</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Master high-frequency words for your PTE Academic exam preparation.</p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search words..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 16px 12px 42px', borderRadius: 12, 
                                border: '1px solid var(--accent-color)', fontSize: 14, outline: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)', background: '#fff'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                        {['All', 'Adj', 'Verb', 'Noun', 'Adv'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                style={{
                                    whiteSpace: 'nowrap', padding: '10px 18px', borderRadius: 12, border: 'none',
                                    background: filter === type ? 'var(--primary-color)' : '#fff',
                                    color: filter === type ? '#fff' : 'var(--text-secondary)',
                                    boxShadow: filter === type ? '0 4px 12px rgba(13, 59, 102, 0.2)' : '0 2px 4px rgba(0,0,0,0.02)',
                                    fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
                                    border: filter === type ? 'none' : '1px solid var(--accent-color)'
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {filteredData.map(item => (
                        <div key={item.id} style={{
                            background: '#fff', borderRadius: 16, padding: '24px',
                            border: '1px solid var(--accent-color)',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all 0.3s ease',
                            display: 'flex', flexDirection: 'column'
                        }}
                            className="vocab-card"
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--primary-color)', letterSpacing: '-0.5px' }}>{item.word}</h3>
                                <span style={{
                                    background: 'var(--accent-color)', color: 'var(--primary-color)', fontSize: 11, fontWeight: 700,
                                    padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase'
                                }}>{item.type}</span>
                            </div>
                            <p style={{ margin: '0 0 16px', color: '#475569', fontSize: 14, lineHeight: 1.6 }}>{item.definition}</p>

                            {item.synonyms.length > 0 && (
                                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    <strong style={{ color: 'var(--primary-color)' }}>Synonyms:</strong> 
                                    {item.synonyms.map(s => <span key={s} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{s}</span>)}
                                </div>
                            )}

                            <div style={{ 
                                background: 'var(--accent-color)', padding: '14px', borderRadius: 12, 
                                borderLeft: '4px solid var(--secondary-color)', marginTop: 'auto',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <span style={{ position: 'absolute', right: 8, top: 4, opacity: 0.1, fontSize: 24 }}>"</span>
                                <p style={{ margin: 0, fontSize: 13, color: 'var(--primary-color)', fontStyle: 'italic', fontWeight: 500, lineHeight: 1.5 }}>{item.example}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 40px', color: '#94a3b8' }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🔎</div>
                        <p style={{ fontSize: 18, fontWeight: 600 }}>No words found</p>
                        <p>Try adjusting your search or filters to find what you're looking for.</p>
                    </div>
                )}
            </div>
            <style>{`
                .vocab-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(13, 59, 102, 0.08);
                }
                @media (max-width: 640px) {
                    .vocab-card { padding: 20px; }
                }
            `}</style>
        </DashboardLayout>
    );
};

export default VocabBook;
