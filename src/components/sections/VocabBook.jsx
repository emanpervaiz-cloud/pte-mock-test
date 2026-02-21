import React, { useState } from 'react';

const VOCAB_DATA = [
    { id: 1, word: 'Ambiguous', type: 'Adj', definition: 'Open to more than one interpretation; having a double meaning.', example: 'The election result was ambiguous.' },
    { id: 2, word: 'Ephemeral', type: 'Adj', definition: 'Lasting for a very short time.', example: 'Fashions are ephemeral, changing with every season.' },
    { id: 3, word: 'Pragmatic', type: 'Adj', definition: 'Dealing with things sensibly and realistically.', example: 'We need a pragmatic approach to the problem.' },
    { id: 4, word: 'Benevolent', type: 'Adj', definition: 'Well meaning and kindly.', example: 'He was a benevolent old man regarding us.' },
    { id: 5, word: 'Capitulate', type: 'Verb', definition: 'Cease to resist an opponent or an unwelcome demand.', example: 'The patriots had to capitulate to the enemy forces.' },
    { id: 6, word: 'Venerable', type: 'Adj', definition: 'Accorded a great deal of respect, especially because of age, wisdom, or character.', example: 'A venerable statesman.' },
    { id: 7, word: 'Hackneyed', type: 'Adj', definition: '(of a phrase or idea) lacking significance through having been overused.', example: 'Hackneyed old sayings.' },
    { id: 8, word: 'Perfidious', type: 'Adj', definition: 'Deceitful and untrustworthy.', example: 'A perfidious lover.' },
    { id: 9, word: 'Exasperate', type: 'Verb', definition: 'Irritate intensely; infuriate.', example: 'This futile process exasperates prison officials.' },
];

const VocabBook = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const filteredData = VOCAB_DATA.filter(item => {
        const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'All' || item.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>📚 Vocab Book</h2>
                <p style={{ color: '#666', fontSize: 15 }}>Master high-frequency words for your PTE Academic exam.</p>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="🔍 Search words..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '12px 16px', borderRadius: 8, border: '1px solid #e0e0e0',
                        fontSize: 14, width: 300, outline: 'none',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                    {['All', 'Adj', 'Verb', 'Noun'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            style={{
                                padding: '8px 16px', borderRadius: 20, border: 'none',
                                background: filter === type ? '#3949ab' : '#e8eaf6',
                                color: filter === type ? '#fff' : '#3949ab',
                                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                                transition: 'all 0.2s'
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
                        background: '#fff', borderRadius: 12, padding: '20px',
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'default'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.06)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#333' }}>{item.word}</h3>
                            <span style={{
                                background: '#f3e5f5', color: '#7b1fa2', fontSize: 11, fontWeight: 600,
                                padding: '2px 8px', borderRadius: 4
                            }}>{item.type}</span>
                        </div>
                        <p style={{ margin: '0 0 12px', color: '#555', fontSize: 14, lineHeight: 1.5 }}>{item.definition}</p>
                        <div style={{ background: '#f8f9fa', padding: '10px 12px', borderRadius: 8, borderLeft: '3px solid #3949ab' }}>
                            <p style={{ margin: 0, fontSize: 13, color: '#444', fontStyle: 'italic' }}>"{item.example}"</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VocabBook;
