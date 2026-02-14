import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Search, Filter } from 'lucide-react';
import { chatAPI } from '../../utils/api';

function SessionHistory({ user, accessToken }) {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [filteredSessions, setFilteredSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMood, setFilterMood] = useState('all');

    useEffect(() => {
        fetchSessions();
    }, []);

    useEffect(() => {
        filterSessions();
    }, [sessions, searchTerm, filterMood]);

    const fetchSessions = async () => {
        try {
            const response = await chatAPI.getSessions(user.id);
            setSessions(response.data);
            setFilteredSessions(response.data);
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterSessions = () => {
        let filtered = [...sessions];

        // Filter by mood
        if (filterMood !== 'all') {
            const moodRange = getMoodRange(filterMood);
            filtered = filtered.filter(
                (s) => s.mood_before >= moodRange.min && s.mood_before <= moodRange.max
            );
        }

        // Filter by search term (date)
        if (searchTerm) {
            filtered = filtered.filter((s) =>
                new Date(s.session_start)
                    .toLocaleDateString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        setFilteredSessions(filtered);
    };

    const getMoodRange = (mood) => {
        switch (mood) {
            case 'low':
                return { min: 1, max: 3 };
            case 'medium':
                return { min: 4, max: 6 };
            case 'high':
                return { min: 7, max: 10 };
            default:
                return { min: 0, max: 10 };
        }
    };

    const getMoodColor = (mood) => {
        if (mood <= 3) return '#EF4444';
        if (mood <= 5) return '#F59E0B';
        if (mood <= 7) return '#FBBF24';
        return '#22C55E';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const viewSession = (sessionId) => {
        navigate(`/session/${sessionId}`);
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                        strokeWidth={1.5}
                    />
                    <input
                        type="text"
                        placeholder="Search by date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-neon/50"
                    />
                </div>

                {/* Mood Filter */}
                <div className="relative">
                    <Filter
                        size={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                        strokeWidth={1.5}
                    />
                    <select
                        value={filterMood}
                        onChange={(e) => setFilterMood(e.target.value)}
                        className="pl-10 pr-8 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-neon/50 appearance-none cursor-pointer"
                    >
                        <option value="all">All Moods</option>
                        <option value="low">Low (1-3)</option>
                        <option value="medium">Medium (4-6)</option>
                        <option value="high">High (7-10)</option>
                    </select>
                </div>
            </div>

            {/* Session List */}
            {loading ? (
                <div className="glass-panel p-12 text-center text-white/40">
                    Loading chats...
                </div>
            ) : filteredSessions.length > 0 ? (
                <div className="space-y-3">
                    {filteredSessions.map((session, index) => (
                        <motion.div
                            key={session.session_id}
                            className="glass-panel-hover p-6 cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 4 }}
                            onClick={() => viewSession(session.session_id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <Calendar size={24} className="text-green-neon" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold text-lg">
                                            {formatDate(session.session_start)}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-2 text-sm text-white/40">
                                                <Clock size={14} strokeWidth={1.5} />
                                                <span>
                                                    {session.duration_minutes
                                                        ? `${session.duration_minutes} min`
                                                        : 'In progress'}
                                                </span>
                                            </div>
                                            {session.mood_after && (
                                                <div className="flex items-center gap-2 text-sm text-white/40">
                                                    <TrendingUp size={14} strokeWidth={1.5} />
                                                    <span>
                                                        Mood improved by {session.mood_after - session.mood_before}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="flex items-center gap-2">
                                        <div>
                                            <p
                                                className="text-2xl font-bold"
                                                style={{ color: getMoodColor(session.mood_before) }}
                                            >
                                                {session.mood_before}
                                            </p>
                                            <p className="text-xs text-white/40">Before</p>
                                        </div>
                                        {session.mood_after && (
                                            <>
                                                <span className="text-white/40">→</span>
                                                <div>
                                                    <p
                                                        className="text-2xl font-bold"
                                                        style={{ color: getMoodColor(session.mood_after) }}
                                                    >
                                                        {session.mood_after}
                                                    </p>
                                                    <p className="text-xs text-white/40">After</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass-panel p-12 text-center">
                    <Calendar size={48} className="mx-auto text-white/20 mb-4" strokeWidth={1.5} />
                    <h4 className="text-lg font-semibold text-white mb-2">No chats found</h4>
                    <p className="text-white/40">
                        {searchTerm || filterMood !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Start your first friendly chat to begin your journey'}
                    </p>
                </div>
            )
            }
        </div >
    );
}

export default SessionHistory;
