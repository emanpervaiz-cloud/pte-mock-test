import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Live Validation
    useEffect(() => {
        const newErrors = {};
        if (name && name.length < 2) newErrors.name = 'Name is too short';
        if (email && !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email address';
        if (password && password.length < 8) newErrors.password = 'Minimum 8 characters';
        setErrors(newErrors);
    }, [name, email, password]);

    const isFormValid = name && email && password && Object.keys(errors).length === 0 && !loading;

    const handleRegister = async (e) => {
        if (e) e.preventDefault();
        if (!isFormValid) return;

        setError('');
        setLoading(true);

        try {
            const result = await AuthService.register(name, email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Registration failed. Try again.');
            }
        } catch (err) {
            setError('An error occurred. Please check your connection.');
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
                <div style={{
                    width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 24px',
                    background: 'var(--color-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(103, 58, 183, 0.2)'
                }}>
                    <span style={{ fontSize: '32px' }}>✨</span>
                </div>

                <h2 style={{ margin: '0 0 8px', color: 'var(--color-text-main)', fontSize: '24px', fontWeight: 800 }}>
                    Create Account
                </h2>
                <p style={{ margin: '0 0 32px', color: 'var(--color-text-sub)', fontSize: '15px' }}>
                    Join thousands of PTE candidates.
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

                <form onSubmit={handleRegister} style={{ textAlign: 'left' }}>
                    <InputField
                        label="Full Name"
                        placeholder="Alex Smith"
                        value={name}
                        onChange={(val) => setName(val)}
                        error={errors.name}
                        icon="👤"
                    />

                    <InputField
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(val) => setEmail(val)}
                        error={errors.email}
                        icon="✉️"
                    />

                    <InputField
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(val) => setPassword(val)}
                        error={errors.password}
                        icon="🔒"
                    />

                    <div style={{ marginTop: '24px' }}>
                        <Button
                            type="submit"
                            fullWidth
                            disabled={!isFormValid}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </div>
                </form>

                <p style={{ marginTop: '28px', fontSize: '14px', color: 'var(--color-text-sub)' }}>
                    Already have an account? <span
                        style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;
