import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, TrendingUp, Heart, Calendar, Shield, Wind, BarChart3 } from 'lucide-react';
import { chatAPI } from '../utils/api';
import { ModeSelectionModal } from '../components';

function Dashboard({ user, accessToken }) {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModeSelection, setShowModeSelection] = useState(false);
    const sessionsPerPage = 5;

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await chatAPI.getSessions(user.id);
            setSessions(response.data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate pagination
    const totalPages = Math.ceil(sessions.length / sessionsPerPage);
    const indexOfLastSession = currentPage * sessionsPerPage;
    const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
    const currentSessions = sessions.slice(indexOfFirstSession, indexOfLastSession);

    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToPage = (pageNumber) => setCurrentPage(pageNumber);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getMoodColor = (mood) => {
        if (mood <= 3) return '#EF4444';
        if (mood <= 5) return '#F59E0B';
        if (mood <= 7) return '#FBBF24';
        return '#22C55E';
    };

    return (
        <div className="min-h-screen bg-black-primary">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Quick Start Section */}
                <motion.section
                    className="glass-panel p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-3xl font-semibold text-white mb-2">Ready to talk?</h2>
                            <p className="text-white/60 mb-6 leading-relaxed">
                                Chat with a caring AI friend for thoughtful support in a safe, private space.
                            </p>

                            <button
                                onClick={() => setShowModeSelection(true)}
                                className="btn-primary flex items-center gap-3"
                            >
                                <Mic size={20} strokeWidth={1.5} />
                                <span>Talk to a Friend</span>
                            </button>

                            <div className="flex items-center gap-6 mt-6 text-sm text-white/40">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-green-neon" strokeWidth={1.5} />
                                    <span>Private & Confidential</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart size={16} className="text-green-neon" strokeWidth={1.5} />
                                    <span>CBT-Informed</span>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="p-12 bg-white/5 rounded-full border border-white/10"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Mic size={64} className="text-green-neon" strokeWidth={1.5} />
                        </motion.div>
                    </div>
                </motion.section>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button
                        onClick={() => navigate('/analytics')}
                        className="glass-panel-hover p-6 text-left"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 4 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <BarChart3 size={24} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Mood Analytics</h3>
                                <p className="text-sm text-white/40">Track your emotional journey</p>
                            </div>
                        </div>
                    </motion.button>

                    <motion.button
                        onClick={() => navigate('/exercises')}
                        className="glass-panel-hover p-6 text-left"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 4 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <Wind size={24} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Grounding Exercises</h3>
                                <p className="text-sm text-white/40">Calm your mind and body</p>
                            </div>
                        </div>
                    </motion.button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <Calendar size={24} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">{sessions.length}</h3>
                                <p className="text-sm text-white/40">Total Chats</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <TrendingUp size={24} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">
                                    {sessions.length > 0
                                        ? (sessions.reduce((sum, s) => sum + s.mood_before, 0) / sessions.length).toFixed(1)
                                        : '--'}
                                </h3>
                                <p className="text-sm text-white/40">Average Mood</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <Heart size={24} className="text-green-neon" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">Active</h3>
                                <p className="text-sm text-white/40">Status</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Sessions */}
                <motion.section
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">Recent Chats</h3>
                        {sessions.length > 0 && (
                            <span className="text-sm text-white/40">
                                Showing {indexOfFirstSession + 1}-{Math.min(indexOfLastSession, sessions.length)} of {sessions.length}
                            </span>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12 glass-panel">
                            <p className="text-white/40">Loading chats...</p>
                        </div>
                    ) : sessions.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-3">
                                {currentSessions.map((session) => (
                                    <motion.button
                                        key={session.session_id}
                                        onClick={() => navigate(`/session/${session.session_id}`)}
                                        className="glass-panel-hover p-4 text-left w-full cursor-pointer"
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-white/5 rounded-lg">
                                                    <Calendar size={20} className="text-green-neon" strokeWidth={1.5} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{formatDate(session.session_start)}</p>
                                                    <p className="text-sm text-white/40">
                                                        {session.duration_minutes ? `${session.duration_minutes} min` : 'In progress'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold" style={{ color: getMoodColor(session.mood_before) }}>
                                                    {session.mood_before}/10
                                                </p>
                                                {session.mood_after && (
                                                    <p className="text-sm text-white/40">
                                                        → {session.mood_after}/10
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-6">
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className="btn-secondary disabled:opacity-50"
                                    >
                                        Previous
                                    </button>

                                    <div className="flex gap-2">
                                        {[...Array(totalPages)].map((_, index) => (
                                            <button
                                                key={index + 1}
                                                onClick={() => goToPage(index + 1)}
                                                className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === index + 1
                                                    ? 'bg-green-neon text-black-primary'
                                                    : 'bg-white/5 hover:bg-white/10 text-white/60'
                                                    }`}
                                            >
                                                {index + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="btn-secondary disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 glass-panel">
                            <Mic size={48} className="mx-auto text-white/20 mb-4" strokeWidth={1.5} />
                            <h4 className="text-lg font-semibold text-white mb-2">No chats yet</h4>
                            <p className="text-white/40 mb-6">Start your first friendly chat to begin your journey</p>
                            <button
                                onClick={() => setShowModeSelection(true)}
                                className="btn-primary"
                            >
                                Start Chatting
                            </button>
                        </div>
                    )}
                </motion.section>
            </main>

            {/* Mode Selection Modal */}
            <ModeSelectionModal
                isOpen={showModeSelection}
                onSelectMode={(mode) => {
                    setShowModeSelection(false);
                    navigate(`/session/${mode}`); // Navigate to /session/voice or /session/chat
                }}
                onClose={() => setShowModeSelection(false)}
            />
        </div>
    );
}

export default Dashboard;
