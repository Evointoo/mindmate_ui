import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage';
import OnboardingAssessment from './pages/OnboardingAssessment';
import VoiceTherapySession from './pages/VoiceTherapySession';
import ChatTherapySession from './pages/ChatTherapySession';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SessionDetail from './pages/SessionDetail';
import MoodAnalytics from './pages/MoodAnalytics';
import GroundingExercises from './pages/GroundingExercises';
import Layout from './components/Layout';
import './styles/global.css';

function App() {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            const userData = JSON.parse(storedUser);
            setAccessToken(storedToken);
            setUser(userData);
        }
        setLoading(false);
    }, []);

    const handleLoginSuccess = (token, userData) => {
        setAccessToken(token);
        setUser(userData);
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        setAccessToken(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black-primary flex items-center justify-center">
                <div className="text-white/40">Loading...</div>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId="810123044890-e60fdng4ao7or90lc7cvjr4kfve4dmkl.apps.googleusercontent.com">
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/"
                        element={
                            user ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
                        }
                    />

                    {/* Onboarding */}
                    <Route
                        path="/onboarding"
                        element={
                            user ? (
                                <OnboardingAssessment
                                    user={user}
                                    accessToken={accessToken}
                                    onComplete={() => window.location.href = '/dashboard'}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    {/* Protected Routes with Layout */}
                    <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/" replace />}>
                        <Route path="/dashboard" element={<Dashboard user={user} accessToken={accessToken} />} />
                        <Route path="/profile" element={<Profile user={user} accessToken={accessToken} />} />
                        <Route path="/session/:sessionId" element={<SessionDetail user={user} accessToken={accessToken} />} />
                        <Route path="/analytics" element={<MoodAnalytics user={user} accessToken={accessToken} />} />
                        <Route path="/exercises" element={<GroundingExercises />} />
                    </Route>

                    {/* Session Routes (Full Screen - No Layout) */}
                    <Route
                        path="/session/voice"
                        element={
                            user ? (
                                <VoiceTherapySession
                                    user={user}
                                    accessToken={accessToken}
                                    onEndSession={() => window.location.href = '/dashboard'}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route
                        path="/session/chat"
                        element={
                            user ? (
                                <ChatTherapySession
                                    user={user}
                                    accessToken={accessToken}
                                    onEndSession={() => window.location.href = '/dashboard'}
                                />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
