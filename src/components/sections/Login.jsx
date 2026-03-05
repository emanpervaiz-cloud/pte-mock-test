import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    // Validation
    useEffect(() => {
        if (email && !/\S+@\S+\.\S/.test(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }

        if (password && password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
        } else {
            setPasswordError('');
        }
    }, [email, password]);

    const isFormValid = email && password && !emailError && !passwordError && !loading;

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        if (!isFormValid) return;

        setError('');
        setLoading(true);

        try {
            const result = await AuthService.login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during sign in. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            background: 'var(--color-background)',
            padding: 'var(--spacing-lg)'
        }}>
            <div style={{
                background: '#ffffff',
                padding: 'var(--spacing-xl)',
                borderRadius: 'var(--mobile-radius)',
                boxShadow: 'var(--shadow-medium)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                border: '1px solid var(--color-border)'
            }}>
                {/* Logo */}
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 24px',
                    background: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(13, 59, 102, 0.2)'
                }}>
                    <span style={{ fontSize: '32px' }}>📖</span>
                </div>

                <h2 style={{ margin: '0 0 8px', color: 'var(--color-text-main)', fontSize: '24px', fontWeight: 800 }}>
                    Welcome Back
                </h2>
                <p style={{ margin: '0 0 32px', color: 'var(--color-text-sub)', fontSize: '15px' }}>
                    Sign in to continue your PTE practice.
                </p>

                {error && (
                    <div style={{
                        background: '#fef2f2', color: 'var(--color-danger)',
                        padding: '12px', borderRadius: '12px', marginBottom: '20px',
                        fontSize: '14px', fontWeight: 600, border: '1px solid #fee2e2'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <InputField
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(val) => setEmail(val)}
                        error={emailError}
                        icon="✉️"
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(val) => setPassword(val)}
                        error={passwordError}
                        icon="🔒"
                    />

                    <div style={{ marginTop: '24px' }}>
                        <Button
                            type="submit"
                            fullWidth
                            disabled={!isFormValid}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </div>
                </form>

                <p style={{ marginTop: '28px', fontSize: '14px', color: 'var(--color-text-sub)' }}>
                    Don't have an account? <span
                        style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => navigate('/register')}
                    >
                        Create Account
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
