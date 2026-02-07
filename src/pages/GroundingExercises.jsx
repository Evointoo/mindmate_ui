import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind, Eye, Heart, Zap, Star } from 'lucide-react';
import { MoodSlider } from '../components';

function GroundingExercises() {
    const [activeExercise, setActiveExercise] = useState(null);
    const [exerciseStep, setExerciseStep] = useState(0);
    const [breathCount, setBreathCount] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [effectiveness, setEffectiveness] = useState(null);

    const exercises = [
        {
            id: 'box-breathing',
            name: 'Box Breathing',
            icon: Wind,
            duration: '4 min',
            description: 'Calm your nervous system with rhythmic breathing',
            color: '#22C55E',
            steps: ['Inhale', 'Hold', 'Exhale', 'Hold'],
            stepDuration: 4000,
        },
        {
            id: '5-4-3-2-1',
            name: '5-4-3-2-1 Technique',
            icon: Eye,
            duration: '5 min',
            description: 'Ground yourself by engaging all five senses',
            color: '#3B82F6',
            steps: [
                '5 things you can see',
                '4 things you can touch',
                '3 things you can hear',
                '2 things you can smell',
                '1 thing you can taste',
            ],
        },
        {
            id: 'body-scan',
            name: 'Body Scan',
            icon: Heart,
            duration: '6 min',
            description: 'Release tension by scanning through your body',
            color: '#8B5CF6',
            steps: [
                'Focus on your feet',
                'Move to your legs',
                'Notice your torso',
                'Relax your arms',
                'Release your neck',
                'Soften your face',
            ],
        },
        {
            id: 'progressive-relaxation',
            name: 'Progressive Muscle Relaxation',
            icon: Zap,
            duration: '8 min',
            description: 'Tense and release muscle groups systematically',
            color: '#F59E0B',
            steps: [
                'Tense your fists',
                'Tense your arms',
                'Tense your shoulders',
                'Tense your legs',
                'Tense your feet',
                'Full body release',
            ],
        },
    ];

    const startExercise = (exercise) => {
        setActiveExercise(exercise);
        setExerciseStep(0);
        setBreathCount(0);
        setShowRating(false);
        setEffectiveness(null);
    };

    const completeExercise = () => {
        setShowRating(true);
    };

    const submitRating = () => {
        // Save rating (could send to backend)
        console.log('Exercise effectiveness:', effectiveness);
        setActiveExercise(null);
        setShowRating(false);
    };

    // Box breathing animation
    const BoxBreathingExercise = () => {
        const [currentStep, setCurrentStep] = useState(0);

        useState(() => {
            const interval = setInterval(() => {
                setCurrentStep((prev) => {
                    const next = (prev + 1) % 4;
                    if (next === 0) setBreathCount((c) => c + 1);
                    return next;
                });
            }, 4000);

            return () => clearInterval(interval);
        }, []);

        return (
            <div className="flex flex-col items-center justify-center h-full">
                <motion.div
                    className="relative w-64 h-64 border-2 rounded-lg"
                    style={{ borderColor: activeExercise.color }}
                    animate={{
                        scale: currentStep === 0 || currentStep === 2 ? 1.2 : 1,
                    }}
                    transition={{ duration: 4, ease: 'linear' }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-2xl font-semibold text-white">
                            {activeExercise.steps[currentStep]}
                        </p>
                    </div>
                </motion.div>

                <p className="text-white/60 mt-8">Breath {breathCount + 1}/6</p>

                {breathCount >= 5 && (
                    <button onClick={completeExercise} className="btn-primary mt-6">
                        Complete Exercise
                    </button>
                )}
            </div>
        );
    };

    // Step-by-step exercise
    const StepExercise = () => (
        <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
            <motion.div
                className="glass-panel p-8 w-full"
                key={exerciseStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
            >
                <div className="text-center">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full"
                        style={{ backgroundColor: `${activeExercise.color}20` }}
                    >
                        <activeExercise.icon
                            size={32}
                            style={{ color: activeExercise.color }}
                            strokeWidth={1.5}
                        />
                    </div>

                    <h3 className="text-3xl font-semibold text-white mb-4">
                        {activeExercise.steps[exerciseStep]}
                    </h3>

                    <p className="text-white/60 mb-8">
                        Take your time. Breathe deeply and focus on this step.
                    </p>

                    <div className="flex items-center justify-center gap-2 mb-8">
                        {activeExercise.steps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all ${index === exerciseStep ? 'w-8' : 'w-1.5'
                                    }`}
                                style={{
                                    backgroundColor:
                                        index <= exerciseStep ? activeExercise.color : 'rgba(255,255,255,0.2)',
                                }}
                            />
                        ))}
                    </div>

                    <div className="flex gap-3 justify-center">
                        {exerciseStep > 0 && (
                            <button
                                onClick={() => setExerciseStep((prev) => prev - 1)}
                                className="btn-secondary"
                            >
                                Previous
                            </button>
                        )}

                        {exerciseStep < activeExercise.steps.length - 1 ? (
                            <button
                                onClick={() => setExerciseStep((prev) => prev + 1)}
                                className="btn-primary"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button onClick={completeExercise} className="btn-primary">
                                Complete Exercise
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black-primary p-6">
            {/* Exit Button (when in exercise) */}
            {activeExercise && (
                <motion.button
                    onClick={() => setActiveExercise(null)}
                    className="fixed top-6 right-6 z-50 p-3 glass-panel rounded-full hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <X size={24} className="text-white" strokeWidth={1.5} />
                </motion.button>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                {!activeExercise ? (
                    <>
                        {/* Title */}
                        <motion.div
                            className="mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2">Grounding Exercises</h1>
                            <p className="text-white/60">Calm your mind and body with these techniques</p>
                        </motion.div>

                        {/* Exercise Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {exercises.map((exercise, index) => (
                                <motion.button
                                    key={exercise.id}
                                    onClick={() => startExercise(exercise)}
                                    className="glass-panel-hover p-6 text-left"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ x: 4 }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="p-3 rounded-lg flex-shrink-0"
                                            style={{ backgroundColor: `${exercise.color}20` }}
                                        >
                                            <exercise.icon
                                                size={24}
                                                style={{ color: exercise.color }}
                                                strokeWidth={1.5}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                                                <span className="text-sm text-white/40">{exercise.duration}</span>
                                            </div>
                                            <p className="text-sm text-white/60 leading-relaxed">
                                                {exercise.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </>
                ) : (
                    <AnimatePresence mode="wait">
                        {!showRating ? (
                            <motion.div
                                className="min-h-[70vh]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {activeExercise.id === 'box-breathing' ? (
                                    <BoxBreathingExercise />
                                ) : (
                                    <StepExercise />
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                className="min-h-[70vh] flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div className="max-w-md w-full glass-panel p-8">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-green-neon/20 rounded-full">
                                            <Star size={32} className="text-green-neon" strokeWidth={1.5} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Exercise Complete!</h2>
                                        <p className="text-white/60">How effective was this exercise for you?</p>
                                    </div>

                                    <MoodSlider
                                        value={effectiveness}
                                        onChange={setEffectiveness}
                                        showIcon={false}
                                        showLabel={true}
                                    />

                                    <button
                                        onClick={submitRating}
                                        disabled={!effectiveness}
                                        className="btn-primary w-full mt-6"
                                    >
                                        Submit & Close
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
}

export default GroundingExercises;
