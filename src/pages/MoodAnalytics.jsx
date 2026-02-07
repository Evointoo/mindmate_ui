import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chatAPI } from '../utils/api';

function MoodAnalytics({ user }) {
    const [moodData, setMoodData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        average: 0,
        trend: 'stable',
        improvement: 0,
    });

    useEffect(() => {
        fetchMoodData();
    }, []);

    const fetchMoodData = async () => {
        try {
            const response = await chatAPI.getSessions(user.id);

            const sessions = response.data;

            // Process mood data
            const data = sessions
                .filter(s => s.mood_before)
                .map(s => ({
                    date: new Date(s.session_start).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                    before: s.mood_before,
                    after: s.mood_after || s.mood_before,
                    timestamp: new Date(s.session_start),
                }))
                .sort((a, b) => a.timestamp - b.timestamp)
                .slice(-10); // Last 10 sessions

            setMoodData(data);

            // Calculate stats
            if (data.length > 0) {
                const avg = data.reduce((sum, d) => sum + d.before, 0) / data.length;
                const recent = data.slice(-3).reduce((sum, d) => sum + d.before, 0) / Math.min(3, data.length);
                const older = data.slice(0, 3).reduce((sum, d) => sum + d.before, 0) / Math.min(3, data.length);
                const improvement = ((recent - older) / older) * 100;

                setStats({
                    average: avg.toFixed(1),
                    trend: improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
                    improvement: Math.abs(improvement).toFixed(0),
                });
            }
        } catch (error) {
            console.error('Failed to fetch mood data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportData = () => {
        const csv = [
            ['Date', 'Mood Before', 'Mood After'],
            ...moodData.map(d => [d.date, d.before, d.after])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mindmate-mood-data.csv';
        a.click();
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-panel p-3">
                    <p className="text-sm text-white font-medium mb-1">{payload[0].payload.date}</p>
                    <p className="text-xs text-white/60">Before: {payload[0].value}/10</p>
                    {payload[1] && <p className="text-xs text-white/60">After: {payload[1].value}/10</p>}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-black-primary p-6">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto space-y-6">
                {/* Title */}
                <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Mood Analytics</h1>
                        <p className="text-white/60">Track your emotional journey over time</p>
                    </div>
                    <button
                        onClick={exportData}
                        disabled={moodData.length === 0}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Download size={18} strokeWidth={1.5} />
                        <span>Export Data</span>
                    </button>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm text-white/60">Average Mood</h3>
                            <Calendar size={18} className="text-white/40" strokeWidth={1.5} />
                        </div>
                        <p className="text-4xl font-bold text-white">{stats.average}</p>
                        <p className="text-xs text-white/40 mt-1">Out of 10</p>
                    </motion.div>

                    <motion.div
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm text-white/60">Trend</h3>
                            {stats.trend === 'improving' ? (
                                <TrendingUp size={18} className="text-green-neon" strokeWidth={1.5} />
                            ) : stats.trend === 'declining' ? (
                                <TrendingDown size={18} className="text-red-500" strokeWidth={1.5} />
                            ) : (
                                <div className="w-4 h-0.5 bg-white/40" />
                            )}
                        </div>
                        <p className="text-4xl font-bold text-white capitalize">{stats.trend}</p>
                        <p className="text-xs text-white/40 mt-1">Recent pattern</p>
                    </motion.div>

                    <motion.div
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm text-white/60">Change</h3>
                            <TrendingUp size={18} className="text-white/40" strokeWidth={1.5} />
                        </div>
                        <p className="text-4xl font-bold text-white">{stats.improvement}%</p>
                        <p className="text-xs text-white/40 mt-1">Last 3 sessions</p>
                    </motion.div>
                </div>

                {/* Chart */}
                <motion.div
                    className="glass-panel p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-semibold text-white mb-6">Mood Over Time</h2>

                    {loading ? (
                        <div className="h-80 flex items-center justify-center">
                            <p className="text-white/40">Loading data...</p>
                        </div>
                    ) : moodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={moodData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="rgba(255,255,255,0.4)"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    domain={[0, 10]}
                                    stroke="rgba(255,255,255,0.4)"
                                    style={{ fontSize: '12px' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="before"
                                    stroke="#22C55E"
                                    strokeWidth={2}
                                    dot={{ fill: '#22C55E', r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Before Session"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="after"
                                    stroke="rgba(255,255,255,0.4)"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={{ fill: 'rgba(255,255,255,0.4)', r: 4 }}
                                    name="After Session"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-80 flex flex-col items-center justify-center">
                            <TrendingUp size={48} className="text-white/20 mb-4" strokeWidth={1.5} />
                            <h3 className="text-lg font-semibold text-white mb-2">No data yet</h3>
                            <p className="text-white/40 text-center">
                                Complete therapy sessions to see your mood trends
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Insights */}
                {moodData.length > 0 && (
                    <motion.div
                        className="glass-panel p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Insights</h2>

                        <div className="space-y-3">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-neon/20 rounded-lg">
                                        <TrendingUp size={18} className="text-green-neon" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white mb-1">Consistency Matters</h4>
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            You've completed {moodData.length} sessions. Regular therapy sessions help build emotional resilience.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {stats.trend === 'improving' && (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-neon/20 rounded-lg">
                                            <TrendingUp size={18} className="text-green-neon" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white mb-1">Positive Progress</h4>
                                            <p className="text-sm text-white/60 leading-relaxed">
                                                Your mood has improved by {stats.improvement}% recently. Keep up the great work!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white/5 rounded-lg">
                                        <Calendar size={18} className="text-white/60" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white mb-1">Track Your Journey</h4>
                                        <p className="text-sm text-white/60 leading-relaxed">
                                            Monitoring your mood helps identify patterns and triggers in your emotional well-being.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}

export default MoodAnalytics;
