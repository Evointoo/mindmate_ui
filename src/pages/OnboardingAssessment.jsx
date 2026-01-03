import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Heart } from 'lucide-react';
import { assessmentAPI } from '../utils/api';
import { MoodSlider } from '../components';

function OnboardingAssessment({ user, accessToken, onComplete }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState({});
    const [moodRating, setMoodRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await assessmentAPI.getQuestions();
            console.debug('Assessment questions response:', response.data);

            // Support either an array response or an object like { questions: [...] }
            const raw = Array.isArray(response.data) ? response.data : response.data?.questions || [];

            // Normalize question schema to what's expected by the UI
            const normalized = raw.map((q) => {
                const type = (q.question_type || '').toLowerCase();

                // Map backend types to UI types
                let question_type = 'multiple_choice';
                if (type.includes('slider')) question_type = 'mood_slider';
                else if (type.includes('choice') || type.includes('select')) question_type = 'multiple_choice';

                // Normalize options to { label, value } objects when API returns string arrays
                let options = null;
                if (Array.isArray(q.options)) {
                    if (q.options.length > 0 && typeof q.options[0] === 'string') {
                        options = q.options.map((opt) => ({ label: opt, value: opt }));
                    } else {
                        options = q.options;
                    }
                }

                return {
                    ...q,
                    question_type,
                    options,
                };
            });

            setQuestions(normalized);
        } catch (error) {
            console.error('Failed to fetch questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (answer) => {
        const currentQuestion = questions[currentIndex];
        setResponses({
            ...responses,
            [currentQuestion.question_id]: answer,
        });
    };

    const goToNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const submitAssessment = async () => {
        setSubmitting(true);

        try {
            // Convert responses object to array format expected by backend
            const responsesArray = Object.entries(responses).map(([questionId, answer]) => ({
                question_id: parseInt(questionId),
                answer: answer
            }));

            // Extract mood rating from question 10's response
            const moodRatingValue = responses[10] || 5; // Default to 5 if not answered

            const response = await assessmentAPI.submitAssessment(user.id, {
                responses: responsesArray,
                mood_rating: moodRatingValue,
            });

            setResults(response.data);
            setShowResults(true);

            // Mark assessment as completed
            localStorage.setItem(`assessment_completed_${user.id}`, 'true');
        } catch (error) {
            console.error('Failed to submit assessment:', error);
            alert('Failed to submit assessment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = () => {
        onComplete(results);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black-primary flex items-center justify-center">
                <p className="text-white/60">Loading assessment...</p>
            </div>
        );
    }

    if (showResults) {
        return (
            <div className="min-h-screen bg-black-primary flex items-center justify-center p-4">
                <motion.div
                    className="max-w-2xl w-full glass-panel p-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-green-neon/20 rounded-full">
                            <CheckCircle size={40} className="text-green-neon" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Assessment Complete</h2>
                        <p className="text-white/60 leading-relaxed">
                            Thank you for completing the assessment. Your responses help us provide better support.
                        </p>
                    </div>

                    {results && (
                        <div className="space-y-4 mb-8">
                            <div className="glass-panel p-6">
                                <h3 className="text-lg font-semibold text-white mb-2">Overall Score</h3>
                                <p className="text-4xl font-bold text-green-neon">{results.total_score}/100</p>
                            </div>

                            <div className="glass-panel p-6">
                                <h3 className="text-lg font-semibold text-white mb-3">Insights</h3>
                                <p className="text-white/80 leading-relaxed">{results.insights}</p>
                            </div>

                            <div className="glass-panel p-6">
                                <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
                                <ul className="space-y-2">
                                    {results.recommendations?.map((rec, index) => (
                                        <li key={index} className="flex items-start gap-3 text-white/80">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-neon mt-2 flex-shrink-0" />
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <button onClick={handleComplete} className="btn-primary w-full">
                        Continue to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const isLastQuestion = currentIndex === questions.length - 1;
    const canProceed = responses[currentQuestion?.question_id] !== undefined;

    return (
        <div className="min-h-screen bg-black-primary flex flex-col">
            {/* Header with Progress */}
            <motion.header
                className="glass-panel border-b"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-lg font-semibold text-white">Initial Assessment</h1>
                        <span className="text-sm text-white/60">
                            Question {currentIndex + 1} of {questions.length}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-green-neon"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            className="glass-panel p-8"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Question */}
                            <div className="mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-white/5 rounded-lg">
                                    <Heart size={24} className="text-white/60" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-2xl font-semibold text-white mb-3">
                                    {currentQuestion?.question_text}
                                </h2>
                                {currentQuestion?.description && (
                                    <p className="text-white/60">{currentQuestion.description}</p>
                                )}
                            </div>

                            {/* Answer Options */}
                            {currentQuestion?.question_type === 'multiple_choice' ? (
                                <div className="space-y-3 mb-8">
                                    {currentQuestion.options && currentQuestion.options.length > 0 ? (
                                        (currentQuestion.options || []).map((option, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => handleAnswer(option.value)}
                                                className={`
                        w-full p-4 rounded-lg border-2 text-left transition-all
                        ${responses[currentQuestion.question_id] === option.value
                                                    ? 'border-green-neon bg-green-neon/10'
                                                    : 'border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20'
                                                }
                      `}
                                                whileHover={{ x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white font-medium">{option.label}</span>
                                                    {responses[currentQuestion.question_id] === option.value && (
                                                        <CheckCircle size={20} className="text-green-neon" strokeWidth={1.5} />
                                                    )}
                                                </div>
                                            </motion.button>
                                        ))
                                    ) : (
                                        <p className="text-white/60">No options available for this question.</p>
                                    )}
                                </div>
                            ) : currentQuestion?.question_type === 'mood_slider' ? (
                                <div className="mb-8">
                                    <MoodSlider
                                        value={responses[currentQuestion.question_id]}
                                        onChange={(value) => handleAnswer(value)}
                                        showIcon={true}
                                        showLabel={true}
                                    />
                                </div>
                            ) : null}

                            {/* Navigation */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={goToPrevious}
                                    disabled={currentIndex === 0}
                                    className="btn-ghost flex items-center gap-2 disabled:opacity-50"
                                >
                                    <ArrowLeft size={18} strokeWidth={1.5} />
                                    <span>Previous</span>
                                </button>

                                {isLastQuestion ? (
                                    <button
                                        onClick={submitAssessment}
                                        disabled={!canProceed || submitting}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <span>{submitting ? 'Submitting...' : 'Complete Assessment'}</span>
                                        <CheckCircle size={18} strokeWidth={1.5} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={goToNext}
                                        disabled={!canProceed}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <span>Next</span>
                                        <ArrowRight size={18} strokeWidth={1.5} />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default OnboardingAssessment;
