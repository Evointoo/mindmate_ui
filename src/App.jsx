import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage';
import OnboardingAssessment from './pages/OnboardingAssessment';
import VoiceTherapySession from './pages/VoiceTherapySession';
import ChatTherapySession from './pages/ChatTherapySession';
import Dashboard from './pages/Dashboard';
import MoodAnalytics from './pages/MoodAnalytics';
import GroundingExercises from './pages/GroundingExercises';
import './styles/global.css';

const APP_STATES = {
    LOGIN: 'login',
    ONBOARDING: 'onboarding',
    DASHBOARD: 'dashboard',
    SESSION: 'session',
    ANALYTICS: 'analytics',
    EXERCISES: 'exercises',
};

function App() {
    const [appState, setAppState] = useState(APP_STATES.LOGIN);
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [sessionMode, setSessionMode] = useState(null); // 'voice' | 'chat'

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            const userData = JSON.parse(storedUser);
            setAccessToken(storedToken);
            setUser(userData);

            // Check if user has completed assessment
            const assessmentCompleted = localStorage.getItem(`assessment_completed_${userData.id}`);
            if (assessmentCompleted === 'true') {
                setAppState(APP_STATES.DASHBOARD);
            } else {
                setAppState(APP_STATES.ONBOARDING);
            }
        }
    }, []);

    const handleLoginSuccess = (token, userData) => {
        setAccessToken(token);
        setUser(userData);
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Check if user has completed assessment
        const assessmentCompleted = localStorage.getItem(`assessment_completed_${userData.id}`);
        if (assessmentCompleted === 'true') {
            setAppState(APP_STATES.DASHBOARD);
        } else {
            setAppState(APP_STATES.ONBOARDING);
        }
    };

    const handleAssessmentComplete = (result) => {
        setAssessmentResult(result);
        setAppState(APP_STATES.DASHBOARD);
    };

    const handleLogout = () => {
        setUser(null);
        setAccessToken(null);
        setAssessmentResult(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setAppState(APP_STATES.LOGIN);
    };

    const startSession = (mode) => {
        setSessionMode(mode); // 'voice' or 'chat'
        setAppState(APP_STATES.SESSION);
    };

    const endSession = () => {
        setSessionMode(null); // Reset mode on session end
        setAppState(APP_STATES.DASHBOARD);
    };

    const navigateTo = (destination) => {
        setAppState(destination);
    };

    const goToDashboard = () => {
        setAppState(APP_STATES.DASHBOARD);
    };

    return (
        <GoogleOAuthProvider clientId="810123044890-e60fdng4ao7or90lc7cvjr4kfve4dmkl.apps.googleusercontent.com">
            <div className="app">
                {appState === APP_STATES.LOGIN && (
                    <LoginPage onLoginSuccess={handleLoginSuccess} />
                )}

                {appState === APP_STATES.ONBOARDING && (
                    <OnboardingAssessment
                        user={user}
                        accessToken={accessToken}
                        onComplete={handleAssessmentComplete}
                    />
                )}

                {appState === APP_STATES.DASHBOARD && (
                    <Dashboard
                        user={user}
                        accessToken={accessToken}
                        onStartSession={startSession}
                        onLogout={handleLogout}
                        onNavigate={navigateTo}
                        assessmentResult={assessmentResult}
                    />
                )}

                {appState === APP_STATES.SESSION && (
                    <>
                        {sessionMode === 'voice' ? (
                            <VoiceTherapySession
                                user={user}
                                accessToken={accessToken}
                                onEndSession={endSession}
                            />
                        ) : sessionMode === 'chat' ? (
                            <ChatTherapySession
                                user={user}
                                accessToken={accessToken}
                                onEndSession={endSession}
                            />
                        ) : null}
                    </>
                )}

                {appState === APP_STATES.ANALYTICS && (
                    <MoodAnalytics
                        user={user}
                        accessToken={accessToken}
                        onBack={goToDashboard}
                    />
                )}

                {appState === APP_STATES.EXERCISES && (
                    <GroundingExercises onBack={goToDashboard} />
                )}
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;
