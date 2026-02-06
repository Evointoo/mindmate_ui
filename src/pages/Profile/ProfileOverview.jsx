import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Heart, Award } from 'lucide-react';
import { chatAPI } from '../../utils/api';

function ProfileOverview({ user, accessToken }) {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const stats = [
        {
            icon: Calendar,
            label: 'Total Sessions',
            value: sessions.length,
            color: 'text-green-neon',
        },
        {
            icon: TrendingUp,
            label: 'Average Mood',
            value: sessions.length > 0
                ? (sessions.reduce((sum, s) => sum + (s.mood_before || 0), 0) / sessions.length).toFixed(1)
                : '--',
            color: 'text-green-neon',
        },
        {
            icon: Heart,
            label: 'Mood Improvement',
            value: sessions.length > 0
                ? `+${(sessions.filter(s => s.mood_after > s.mood_before).length / sessions.length * 100).toFixed(0)}%`
                : '--',
            color: 'text-green-neon',
        },
        {
            icon: Award,
            label: 'Days Active',
            value: new Set(sessions.map(s => new Date(s.session_start).toDateString())).size,
            color: 'text-green-neon',
        },
    ];

    return (
        <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-green-neon/10 border-2 border-green-neon flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-neon">
                        {user.email[0].toUpperCase()}
                    </span>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">{user.name || user.email.split('@')[0]}</h2>
                    <p className="text-white/60">{user.email}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <stat.icon size={24} className={stat.color} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                                <p className="text-sm text-white/40">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity */}
            <div>
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                {loading ? (
                    <div className="glass-panel p-6 text-center text-white/40">Loading...</div>
                ) : sessions.length > 0 ? (
                    <div className="space-y-3">
                        {sessions.slice(0, 5).map((session) => (
                            <motion.button
                                key={session.session_id}
                                onClick={() => navigate(`/session/${session.session_id}`)}
                                className="glass-panel-hover p-4 text-left w-full cursor-pointer"
                                whileHover={{ x: 4 }}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={20} className="text-green-neon" strokeWidth={1.5} />
                                        <div>
                                            <p className="text-white font-medium">
                                                {new Date(session.session_start).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                            <p className="text-sm text-white/40">
                                                {session.duration_minutes ? `${session.duration_minutes} min` : 'In progress'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-neon font-semibold">{session.mood_before}/10</p>
                                        {session.mood_after && (
                                            <p className="text-sm text-white/40">→ {session.mood_after}/10</p>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel p-6 text-center text-white/40">
                        No sessions yet. Start your first therapy session!
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileOverview;
