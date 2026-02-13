import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Loader } from 'lucide-react';
import { personalityAPI } from '../utils/api';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function PersonalityAnalysis({ user }) {
    const navigate = useNavigate();
    const [step, setStep] = useState('questions'); // 'questions', 'analyzing', 'results'
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const response = await personalityAPI.getQuestions();
            setQuestions(response.data.questions);
        } catch (err) {
            console.error('Failed to load questions:', err);
            setError('Failed to load questions');
        }
    };

    const handleAnswerSelect = (answer) => {
        const newResponses = [...responses];
        newResponses[currentQuestion] = {
            question_id: questions[currentQuestion].question_id,
            answer
        };
        setResponses(newResponses);

        // Auto-advance
        if (currentQuestion < questions.length - 1) {
            setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
        } else {
            // All questions answered
            setTimeout(() => submitAnalysis(newResponses), 500);
        }
    };

    const submitAnalysis = async (finalResponses) => {
        setStep('analyzing');
        setLoading(true);

        try {
            const response = await personalityAPI.analyze({
                user_id: user.id,
                responses: finalResponses
            });
            setAnalysisResult(response.data);
            setStep('results');
        } catch (err) {
            console.error('Analysis failed:', err);
            setError('Analysis failed. Please try again.');
            setStep('questions');
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = () => {
        if (!analysisResult) return [];

        const traits = analysisResult.personality_traits;
        return [
            { trait: 'Introversion', value: traits.introversion },
            { trait: 'Confidence', value: traits.confidence },
            { trait: 'Emotional Stability', value: traits.emotional_stability },
            { trait: 'Creativity', value: traits.creativity },
            { trait: 'Discipline', value: traits.discipline }
        ];
    };

    return (
        <div className="min-h-screen bg-black-primary flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black-primary via-black-secondary to-black-tertiary" />
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-neon/5 rounded-full blur-3xl" />

            <motion.div
                className="relative z-10 w-full max-w-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <AnimatePresence mode="wait">
                    {step === 'questions' && questions.length > 0 && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel p-8"
                        >
                            {/* Progress */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white/60">
                                        Question {currentQuestion + 1} of {questions.length}
                                    </span>
                                    <span className="text-sm text-green-neon">
                                        {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-neon"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>

                            {/* Question */}
                            <div className="mb-8">
                                <div className="flex items-start gap-3 mb-4">
                                    <Brain className="text-green-neon mt-1" size={24} />
                                    <h2 className="text-2xl font-bold text-white">
                                        {questions[currentQuestion].question_text}
                                    </h2>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleAnswerSelect(option.value)}
                                        className={`w-full p-4 rounded-lg text-left transition-all ${responses[currentQuestion]?.answer === option.value
                                                ? 'bg-green-neon/20 border-2 border-green-neon'
                                                : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'
                                            }`}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <span className="text-white">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Navigation */}
                            {currentQuestion > 0 && (
                                <button
                                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                                    className="btn-ghost mt-6"
                                >
                                    Previous Question
                                </button>
                            )}
                        </motion.div>
                    )}

                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-panel p-12 text-center"
                        >
                            <Loader className="animate-spin text-green-neon mx-auto mb-6" size={48} />
                            <h2 className="text-2xl font-bold text-white mb-3">Analyzing Your Personality...</h2>
                            <p className="text-white/60">This will take just a moment</p>
                        </motion.div>
                    )}

                    {step === 'results' && analysisResult && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-3">Your Personality Profile</h2>
                                <p className="text-white/60">{analysisResult.summary}</p>
                            </div>

                            {/* Radar Chart */}
                            <div className="mb-8 bg-white/5 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 text-center">Personality Traits</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RadarChart data={prepareChartData()}>
                                        <PolarGrid stroke="#ffffff20" />
                                        <PolarAngleAxis dataKey="trait" tick={{ fill: '#fff', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#ffffff60' }} />
                                        <Radar dataKey="value" stroke="#39FF14" fill="#39FF14" fillOpacity={0.3} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bar Chart */}
                            <div className="mb-8 bg-white/5 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 text-center">Trait Breakdown</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={prepareChartData()}>
                                        <XAxis dataKey="trait" tick={{ fill: '#fff', fontSize: 11 }} />
                                        <YAxis domain={[0, 100]} tick={{ fill: '#ffffff60' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #39FF14' }} />
                                        <Bar dataKey="value" fill="#39FF14" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Behavioral Patterns */}
                            <div className="mb-8 grid grid-cols-3 gap-4">
                                <div className="bg-white/5 rounded-lg p-4 text-center">
                                    <p className="text-xs text-white/60 mb-2">Decision Making</p>
                                    <p className="text-sm font-semibold text-green-neon capitalize">
                                        {analysisResult.behavioral_patterns.decision_making}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 text-center">
                                    <p className="text-xs text-white/60 mb-2">Stress Response</p>
                                    <p className="text-sm font-semibold text-green-neon capitalize">
                                        {analysisResult.behavioral_patterns.stress_response}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-4 text-center">
                                    <p className="text-xs text-white/60 mb-2">Social Style</p>
                                    <p className="text-sm font-semibold text-green-neon capitalize">
                                        {analysisResult.behavioral_patterns.social_style}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/create-ai')}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                Create Your AI Companion
                                <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {error && (
                    <motion.div
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-sm text-red-400 text-center">{error}</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default PersonalityAnalysis;
