import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, TrendingUp, Download } from 'lucide-react';
import { chatAPI } from '../utils/api';

function SessionDetail({ user, accessToken }) {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSessionHistory();
    }, [sessionId]);

    const fetchSessionHistory = async () => {
        try {
            const response = await chatAPI.getSessionHistory(sessionId, user.id);
            setSessionData(response.data);
        } catch (error) {
            console.error('Failed to fetch session history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const exportConversation = () => {
        if (!sessionData) return;

        const text = sessionData.messages
            .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
            .join('\n\n');

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `therapy-session-${sessionId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-white/40">Loading conversation...</div>
            </div>
        );
    }

    if (!sessionData) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Session not found</h2>
                    <button onClick={() => navigate('/profile')} className="btn-secondary mt-4">
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} strokeWidth={1.5} />
                        <span>Back to Profile</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Therapy Session</h1>
                            <p className="text-white/60">
                                {sessionData.messages[0]?.timestamp &&
                                    formatDate(sessionData.messages[0].timestamp)}
                            </p>
                        </div>
                        <button
                            onClick={exportConversation}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Download size={18} strokeWidth={1.5} />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Session Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="glass-panel p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Calendar size={20} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm text-white/40">Status</p>
                                <p className="text-white font-semibold capitalize">{sessionData.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <TrendingUp size={20} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm text-white/40">Mood</p>
                                <p className="text-white font-semibold">
                                    {sessionData.mood_before}/10
                                    {sessionData.mood_after && ` → ${sessionData.mood_after}/10`}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg">
                                <Clock size={20} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-sm text-white/40">Messages</p>
                                <p className="text-white font-semibold">{sessionData.messages.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conversation */}
                <div className="glass-panel p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Conversation</h2>
                    <div className="space-y-4">
                        {sessionData.messages.map((message, index) => (
                            <motion.div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div
                                    className={`max-w-[80%] p-4 rounded-lg ${message.role === 'user'
                                            ? 'bg-green-neon/10 border border-green-neon/30'
                                            : 'bg-white/5 border border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`text-xs font-semibold uppercase ${message.role === 'user'
                                                    ? 'text-green-neon'
                                                    : 'text-white/60'
                                                }`}
                                        >
                                            {message.role === 'user' ? 'You' : 'Therapist'}
                                        </span>
                                        <span className="text-xs text-white/40">
                                            {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-white leading-relaxed">{message.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default SessionDetail;
