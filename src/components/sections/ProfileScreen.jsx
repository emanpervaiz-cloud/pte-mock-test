import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import StatCard from '../ui/StatCard';
import ListItem from '../ui/ListItem';

const ProfileScreen = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(AuthService.getUser());
    const [targetScore, setTargetScore] = useState(65);

    useEffect(() => {
        // Load target score from localStorage or context if available
        const stored = localStorage.getItem('pte_target_score');
        if (stored) setTargetScore(parseInt(stored));
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const handleSaveTarget = (score) => {
        setTargetScore(score);
        localStorage.setItem('pte_target_score', score);
    };

    return (
        <div style={{ padding: 'var(--mobile-margin)', background: 'var(--color-background)', minHeight: '100vh' }}>
            {/* Profile Header */}
            <div style={{
                textAlign: 'center',
                padding: '32px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-jumbo)',
                    fontWeight: 800,
                    boxShadow: 'var(--shadow-medium)'
                }}>
                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-xxl)', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                        {user?.name || 'Student Name'}
                    </h1>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-sub)', margin: '4px 0 0 0' }}>
                        PTE Academic Student
                    </p>
                </div>
            </div>

            {/* Target Score Section */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '16px' }}>
                    My Goal
                </h2>
                <StatCard
                    label="Target PTE Score"
                    value={targetScore}
                    icon="🎯"
                    color="var(--color-secondary)"
                    style={{ marginBottom: '16px' }}
                />
                <div style={{ background: '#fff', borderRadius: 'var(--mobile-radius)', padding: '20px', border: '1px solid var(--color-border)' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--color-text-sub)', marginBottom: '12px' }}>
                        Adjust Target Score
                    </label>
                    <input
                        type="range"
                        min="30"
                        max="90"
                        value={targetScore}
                        onChange={(e) => handleSaveTarget(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sub)' }}>
                        <span>30</span>
                        <span>90</span>
                    </div>
                </div>
            </div>

            {/* Settings Section */}
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '16px' }}>
                    Account Settings
                </h2>
                <ListItem
                    title="Personal Information"
                    subtitle="Email, Password, and Name"
                    icon="👤"
                    onClick={() => { }}
                />
                <ListItem
                    title="Notification Preferences"
                    subtitle="Control your alerts"
                    icon="🔔"
                    onClick={() => { }}
                />
                <ListItem
                    title="Theme & Appearance"
                    subtitle="Light/Dark mode"
                    icon="🎨"
                    onClick={() => { }}
                />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button variant="danger" fullWidth onClick={handleLogout} icon="🚪">
                    Logout Session
                </Button>
            </div>
        </div>
    );
};

export default ProfileScreen;
