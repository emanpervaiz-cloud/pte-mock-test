import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setLoading(true);
        const success = await AuthService.register(name, email, password);
        setLoading(false);

        if (success) {
            // Automatically log them in (already handled by AuthService.register setting localStorage)
            navigate('/');
        } else {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8f9fe 0%, #e0f2fe 100%)',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                background: '#ffffff',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
                    background: 'linear-gradient(135deg, #673ab7, #9c27b0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 24
                }}>
                    PTE
                </div>
                <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '24px' }}>Create an Account</h2>
                <p style={{ margin: '0 0 32px', color: '#64748b', fontSize: '14px' }}>
                    Sign up to access your practice modules.
                </p>

                {error && (
                    <div style={{
                        background: '#fee2e2', color: '#b91c1c', padding: '12px',
                        borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Alex Smith"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alex@example.com"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '8px' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '15px',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(90deg, #6366F1, #8B5CF6)',
                            color: '#ffffff',
                            border: 'none',
                            padding: '14px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '8px',
                            transition: 'transform 0.2s',
                            opacity: loading ? 0.8 : 1
                        }}
                        onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
                    Already have an account? <span
                        style={{ color: '#6366F1', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate('/login')}
                    >
                        Sign in here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
