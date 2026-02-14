import { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Shield, Mic, Brain } from 'lucide-react';
import { authAPI } from '../utils/api';

function LoginPage({ onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleSuccess = async (credentialResponse) => {
        console.log('Google Sign-In successful');
        setLoading(true);
        setError(null);

        try {
            // Direct API call after Google sign-in (no phone number)
            const response = await authAPI.googleSignIn({
                google_token: credentialResponse.credential,
                language_preference: 'english'
            });

            const { access_token, user } = response.data;
            onLoginSuccess(access_token, user);

            // App.jsx will handle redirect based on user.profile_completed
        } catch (err) {
            console.error('Sign-in error:', err);
            setError(err.response?.data?.detail || 'Sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Sign-In failed. Please try again.');
    };

    return (
        <div className="min-h-screen bg-black-primary flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle background gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-black-primary via-black-secondary to-black-tertiary" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-neon/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-neon/5 rounded-full blur-3xl" />

            {/* Main content */}
            <motion.div
                className="relative z-10 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Glass card */}
                <div className="glass-panel p-8">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            className="inline-flex items-center justify-center mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img src="/logo.svg" alt="MindMate Logo" className="h-20 w-auto object-contain" />
                        </motion.div>
                        <p className="text-white/60 text-sm leading-relaxed mt-2">
                            Your trusted AI companion for mental wellness and friendly chats
                        </p>
                    </div>

                    {/* Sign in section */}
                    <div className="space-y-6">
                        <p className="text-center text-white/80 font-medium">Sign in to continue</p>

                        {/* Google Sign-In Button */}
                        <div className="flex justify-center">
                            {loading ? (
                                <div className="text-white/60">Signing in...</div>
                            ) : (
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    useOneTap={true}
                                    theme="filled_black"
                                    size="large"
                                    text="continue_with"
                                    shape="rectangular"
                                />
                            )}
                        </div>

                        {/* Features */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-sm text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-neon" />
                                <span>Voice-first friendly chats</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-neon" />
                                <span>CBT-informed guidance</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-white/60">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-neon" />
                                <span>Private & confidential</span>
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <motion.div
                            className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        </motion.div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-center text-xs text-white/40">
                            Private • Secure • Confidential
                        </p>
                    </div>
                </div>

                {/* Additional info */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <motion.div
                        className="text-center"
                        whileHover={{ y: -2 }}
                    >
                        <div className="inline-flex items-center justify-center w-10 h-10 mb-2 bg-white/5 rounded-lg">
                            <Shield size={18} className="text-green-neon" strokeWidth={1.5} />
                        </div>
                        <p className="text-xs text-white/40">Secure</p>
                    </motion.div>

                    <motion.div
                        className="text-center"
                        whileHover={{ y: -2 }}
                    >
                        <div className="inline-flex items-center justify-center w-10 h-10 mb-2 bg-white/5 rounded-lg">
                            <Mic size={18} className="text-green-neon" strokeWidth={1.5} />
                        </div>
                        <p className="text-xs text-white/40">Voice AI</p>
                    </motion.div>

                    <motion.div
                        className="text-center"
                        whileHover={{ y: -2 }}
                    >
                        <div className="inline-flex items-center justify-center w-10 h-10 mb-2 bg-white/5 rounded-lg">
                            <Brain size={18} className="text-green-neon" strokeWidth={1.5} />
                        </div>
                        <p className="text-xs text-white/40">CBT</p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default LoginPage;
