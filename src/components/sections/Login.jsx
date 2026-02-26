import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        const success = await AuthService.login(email, password);
        setLoading(false);

        if (success) {
            navigate('/');
        } else {
            setError('Invalid credentials. Please try again.');
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
                <h2 style={{ margin: '0 0 8px', color: '#0f172a', fontSize: '24px' }}>Welcome Back</h2>
                <p style={{ margin: '0 0 32px', color: '#64748b', fontSize: '14px' }}>
                    Sign in to access your practice modules.
                </p>

                {error && (
                    <div style={{
                        background: '#fee2e2', color: '#b91c1c', padding: '12px',
                        borderRadius: '8px', marginBottom: '20px', fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
                    Don't have an account? <span
                        style={{ color: '#6366F1', fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate('/register')}
                    >
                        Register here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
